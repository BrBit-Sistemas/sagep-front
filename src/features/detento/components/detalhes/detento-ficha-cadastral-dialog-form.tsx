import type { Detento, DetentoFichaCadastral } from '../../types';
import type { CreateDetentoFichaCadastralSchema } from '../../schemas';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { formatCpf } from 'src/utils/format-string';
import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { getProfissoes } from 'src/api/profissoes/profissoes';
import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { detentoService } from '../../data';
import { detentoKeys } from '../../hooks/keys';
import { createDetentoFichaCadastralSchema } from '../../schemas';
import { parseRgOrgaoUf, fichaInativaToCreateFormValues } from '../../helper';
import { DetentoFichaInativaSelector } from './detento-ficha-inativa-selector';
import { useGetDetentoFichasInativas } from '../../hooks/use-get-detento-fichas-inativas';
import { DetentoFichaCadastralInternaBuilder } from './detento-ficha-cadastral-interna-builder';

// Schema estendido para o formulário interno que inclui campos separados de RG
const dialogFormSchema = createDetentoFichaCadastralSchema
  .extend({
    rg_orgao: z.string().min(1, 'Órgão expedidor é obrigatório'),
    rg_uf: z.string().min(1, 'UF do RG é obrigatória'),
  })
  .omit({
    rg_orgao_uf: true, // Remove a validação obrigatória do campo combinado
    rg: true, // Remove a validação do campo RG para sobrescrever
  })
  .extend({
    rg_orgao_uf: z.string().optional(), // Torna o campo combinado opcional
    rg: z
      .string()
      .optional()
      .transform((value) => value || '') // Transforma undefined/null em string vazia
      .refine((value) => {
        // Se está vazio ou só espaços, é válido
        if (!value || value.trim() === '') return true;
        // Se tem conteúdo, deve ter entre 3 e 15 caracteres
        return value.length >= 3 && value.length <= 15;
      }, 'RG deve ter entre 3 e 15 caracteres'),
  });

type DetentoFichaCadastralFormProps = {
  detento: Detento;
  detentoId: string;
  fichaCadastralId?: string;
  defaultValues?: CreateDetentoFichaCadastralSchema;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const INITIAL_VALUES: CreateDetentoFichaCadastralSchema & { rg_orgao?: string; rg_uf?: string } = {
  detento_id: '',
  // Identificação pessoal
  nome: '',
  cpf: '',
  rg: '',
  rg_expedicao: '',
  rg_orgao_uf: '',
  rg_orgao: '',
  rg_uf: '',
  data_nascimento: '',
  naturalidade: '',
  naturalidade_uf: '',
  filiacao_mae: '',
  filiacao_pai: '',
  // Situação prisional
  regime: '',
  unidade_prisional: '',
  prontuario: '',
  sei: '',
  // Endereço e contato
  endereco: '',
  regiao_administrativa: '',
  telefone: '',
  // Escolaridade
  escolaridade: '',
  // Saúde
  tem_problema_saude: false,
  problema_saude: '',
  // Restrições de trabalho
  regiao_bloqueada: '',
  // Experiência e qualificação
  experiencia_profissional: '',
  fez_curso_sistema_prisional: '',
  disponibilidade_trabalho: '',
  ja_trabalhou_funap: false,
  ano_trabalho_anterior: '',
  profissao_01: '',
  profissao_02: '',
  // Artigos penais
  artigos_penais: [],
  // Declarações e responsáveis
  responsavel_preenchimento: '',
  assinatura: '',
  data_assinatura: formatDateToYYYYMMDD(new Date()),
  // PDF gerado
  pdf_path: '',
  documentos: [],
};

export const DetentoFichaCadastralForm = ({
  detento,
  detentoId,
  fichaCadastralId,
  defaultValues,
  onCancel,
  onSuccess,
}: DetentoFichaCadastralFormProps) => {
  const isEditing = !!fichaCadastralId;
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecoverySelector, setShowRecoverySelector] = useState(false);
  const [recoveredFromFicha, setRecoveredFromFicha] = useState<DetentoFichaCadastral | null>(null);

  const { data: fichasInativas = [], isLoading: isLoadingFichasInativas } =
    useGetDetentoFichasInativas(detentoId, {
      enabled: !isEditing,
    });

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 1,
    limit: 1000,
  });

  // Find the unit name for display
  const getUnidadeName = useCallback(
    (unidadeId: string) => {
      const unidade = unidades.find((u) => u.id === unidadeId);
      return unidade?.nome || unidadeId;
    },
    [unidades]
  );

  // Preenche valores iniciais com dados do detento se não for edição
  const initialValues = isEditing
    ? defaultValues
    : {
        ...INITIAL_VALUES,
        detento_id: detento.id,
        nome: detento.nome,
        cpf: detento.cpf,
        prontuario: detento.prontuario ?? '',
        data_nascimento: detento.data_nascimento
          ? formatDateToYYYYMMDD(detento.data_nascimento)
          : '',
        regime: detento.regime,
        escolaridade: detento.escolaridade,
        unidade_prisional: getUnidadeName(detento.unidade_id),
        filiacao_mae: detento.mae,
      };

  const methods = useForm({
    resolver: zodResolver(dialogFormSchema) as any,
    defaultValues: initialValues,
  });
  const isFormDirty = methods.formState.isDirty;

  const handleSelectFichaInativa = useCallback(
    (fichaInativa: DetentoFichaCadastral) => {
      const values = fichaInativaToCreateFormValues(fichaInativa, detento);
      const { rgOrgao, rgUf } = parseRgOrgaoUf(values.rg_orgao_uf);

      methods.reset({
        ...values,
        unidade_prisional: getUnidadeName(detento.unidade_id),
        data_nascimento: values.data_nascimento ? formatDateToYYYYMMDD(values.data_nascimento) : '',
        rg_orgao: rgOrgao,
        rg_uf: rgUf,
      } as any);
      setRecoveredFromFicha(fichaInativa);
      setShowRecoverySelector(false);
    },
    [detento, getUnidadeName, methods]
  );

  const handleSkipRecovery = useCallback(() => {
    setShowRecoverySelector(false);
    setRecoveredFromFicha(null);
  }, []);

  // Normaliza CPF para o componente de máscara não quebrar
  useEffect(() => {
    const cpfRaw = (initialValues as any)?.cpf;
    if (cpfRaw) {
      methods.setValue('cpf', formatCpf(cpfRaw));
    }
  }, []);

  // Cache compartilhado de ID -> Nome para profissões (alimentado pelos campos)
  const globalProfissaoLabelCache = useRef<Map<string, string>>(new Map());
  const handleLabelUpdate = (id: string, nome: string) => {
    if (!globalProfissaoLabelCache.current.has(id)) {
      globalProfissaoLabelCache.current.set(id, nome);
    }
  };

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        // Combinar órgão expedidor e UF do RG em um campo só
        const rgOrgao = (data as any).rg_orgao?.trim() || '';
        const rgUf = (data as any).rg_uf?.trim() || '';

        // Combinar os campos apenas se pelo menos um foi preenchido
        if (rgOrgao && rgUf) {
          (data as any).rg_orgao_uf = `${rgOrgao}/${rgUf}`;
        } else if (rgOrgao) {
          (data as any).rg_orgao_uf = rgOrgao;
        } else if (rgUf) {
          (data as any).rg_orgao_uf = rgUf;
        } else {
          (data as any).rg_orgao_uf = undefined;
        }

        // Remover campos separados para evitar conflito no backend
        delete (data as any).rg_orgao;
        delete (data as any).rg_uf;

        // Converter profissao_01 e profissao_02 de ID para nome antes de enviar
        const apiProfissoes = getProfissoes();
        const rawProfissao01 = (data as any).profissao_01 || '';
        const rawProfissao02 = (data as any).profissao_02 || '';

        const isUuid = (v: string) => /^[0-9a-fA-F-]{36}$/.test(String(v));
        const [resolvedProfissao01, resolvedProfissao02] = await Promise.all([
          rawProfissao01
            ? (() => {
                const cached = globalProfissaoLabelCache.current.get(String(rawProfissao01));
                if (cached) return Promise.resolve(cached);
                if (!isUuid(String(rawProfissao01))) return Promise.resolve(String(rawProfissao01));
                return apiProfissoes
                  .findOne(String(rawProfissao01))
                  .then((res) => res?.nome || String(rawProfissao01))
                  .catch(() => String(rawProfissao01));
              })()
            : Promise.resolve(''),
          rawProfissao02
            ? (() => {
                const cached = globalProfissaoLabelCache.current.get(String(rawProfissao02));
                if (cached) return Promise.resolve(cached);
                if (!isUuid(String(rawProfissao02))) return Promise.resolve(String(rawProfissao02));
                return apiProfissoes
                  .findOne(String(rawProfissao02))
                  .then((res) => res?.nome || String(rawProfissao02))
                  .catch(() => String(rawProfissao02));
              })()
            : Promise.resolve(''),
        ]);

        // Substituir no payload
        (data as any).profissao_01 = resolvedProfissao01;
        (data as any).profissao_02 = resolvedProfissao02;

        // Pre-validação: prontuário único (bloqueia antes da criação)
        const prontuario = String((data as any).prontuario || '').trim();
        if (prontuario) {
          const existing = await detentoService.paginate({ page: 1, limit: 1, search: prontuario });
          const found = existing.items?.find(
            (d: any) => String(d.prontuario).trim() === prontuario
          );
          if (found && found.id !== detentoId) {
            methods.setError('prontuario' as any, {
              type: 'manual',
              message: 'Prontuário não está disponível.',
            });
            setLoading(false);
            return;
          }
          (data as any).prontuario = prontuario;
        } else {
          delete (data as any).prontuario;
        }

        if (isEditing && fichaCadastralId) {
          await detentoService.updateFichaCadastral(fichaCadastralId, {
            ...data,
            detento_id: detentoId,
          });
          toast.success('Ficha cadastral atualizada com sucesso!');
        } else {
          await detentoService.createFichaCadastral({ ...data, detento_id: detentoId });
          toast.success('Ficha cadastral criada com sucesso!');
        }

        // Invalidar cache das fichas cadastrais E das URLs dos PDFs
        await queryClient.invalidateQueries({ queryKey: detentoKeys.fichasCadastrais(detentoId) });

        // Forçar refetch para garantir que o PDF atualizado seja carregado
        await queryClient.refetchQueries({ queryKey: detentoKeys.fichasCadastrais(detentoId) });

        methods.reset();
        onSuccess?.();
      } catch (err: any) {
        const status = err?.response?.status;
        let message: any = err?.response?.data?.message ?? err?.message;
        if (Array.isArray(message)) message = message.join(' ');
        if (!message || typeof message !== 'string') {
          message = err?.response?.data?.detail || 'Erro inesperado.';
        }
        if (status === 409) {
          const msg = String(message || '');
          if (
            msg.toLowerCase().includes('prontuário') ||
            msg.toLowerCase().includes('prontuario')
          ) {
            methods.setError('prontuario' as any, { type: 'manual', message: msg });
          } else {
            setError('Prontuário não está disponível.');
          }
        } else {
          setError(String(message));
        }
        console.error('Erro ao salvar ficha cadastral:', err);
      } finally {
        setLoading(false);
      }
    },
    (errors) => {
      // Loga os erros do zod
      console.error('Zod validation errors:', errors);
    }
  );

  // const handleRemovePdf = () => {
  //   methods.setValue('pdf_path', '');
  //   console.log('pdf_path', methods.getValues('pdf_path'));
  // };

  useEffect(() => {
    if (!isEditing) {
      if (isLoadingFichasInativas) {
        return;
      }

      if (!isFormDirty) {
        setShowRecoverySelector(fichasInativas.length > 0);
      }
    }
  }, [isEditing, fichasInativas.length, isLoadingFichasInativas, isFormDirty]);

  useEffect(() => {
    if (isEditing) {
      // Separar o campo combinado rg_orgao_uf nos campos individuais para edição
      const { rgOrgao, rgUf } = parseRgOrgaoUf(defaultValues?.rg_orgao_uf);

      // Garantir que os campos do detento sejam sempre atualizados, mesmo em modo de edição
      methods.reset({
        ...defaultValues,
        rg_orgao: rgOrgao,
        rg_uf: rgUf,
        nome: detento.nome,
        cpf: detento.cpf,
        prontuario: detento.prontuario ?? '',
        data_nascimento: detento.data_nascimento
          ? formatDateToYYYYMMDD(detento.data_nascimento)
          : '',
        regime: detento.regime,
        escolaridade: detento.escolaridade,
        unidade_prisional: getUnidadeName(detento.unidade_id),
        filiacao_mae: detento.mae,
      } as any);
    } else if (!recoveredFromFicha) {
      // Preenche os campos com os dados do detento ao criar
      methods.reset({
        ...INITIAL_VALUES,
        detento_id: detento.id,
        nome: detento.nome,
        cpf: detento.cpf,
        prontuario: detento.prontuario ?? '',
        data_nascimento: detento.data_nascimento
          ? formatDateToYYYYMMDD(detento.data_nascimento)
          : '',
        regime: detento.regime,
        escolaridade: detento.escolaridade,
        unidade_prisional: getUnidadeName(detento.unidade_id),
        filiacao_mae: detento.mae,
      });
    }
  }, [isEditing, defaultValues, detento, methods, getUnidadeName, recoveredFromFicha]);

  const shouldShowRecoverySelector = !isEditing && showRecoverySelector && fichasInativas.length > 0;

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="div">
          Ficha Cadastral
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preencha os campos abaixo para{' '}
          {isEditing ? 'editar a ficha cadastral.' : 'adicionar uma nova ficha cadastral.'}
        </Typography>
      </Box>

      <Box sx={{ pb: 0 }}>
        {shouldShowRecoverySelector ? (
          <Box sx={{ py: 2 }}>
            <DetentoFichaInativaSelector
              fichasInativas={fichasInativas}
              isLoading={isLoadingFichasInativas}
              onSelectFicha={handleSelectFichaInativa}
              onSkip={handleSkipRecovery}
            />
          </Box>
        ) : (
          <>
            {recoveredFromFicha && !isEditing && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Dados recuperados da ficha anterior para revisão antes de salvar.
              </Alert>
            )}
            <Form methods={methods} onSubmit={handleSubmit}>
              <Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress />
                  </Box>
                )}
                <DetentoFichaCadastralInternaBuilder
                  loading={loading}
                  statusValidacao={
                    (methods.getValues() as any)?.status_validacao ??
                    (defaultValues as any)?.status_validacao
                  }
                  unidades={unidades}
                  onProfissaoLabelUpdate={handleLabelUpdate}
                  fichaCadastralId={fichaCadastralId}
                  detentoId={detentoId}
                />
              </Box>
            </Form>
          </>
        )}
      </Box>

      {!shouldShowRecoverySelector && (
        <Box sx={{ p: 3, pt: 2, gap: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} variant="outlined" color="primary" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      )}
    </Card>
  );
};

export const DetentoFichaCadastralDialogForm = DetentoFichaCadastralForm;
