import type { Detento, DetentoFichaCadastral } from '../../types';
import type { CreateDetentoFichaCadastralSchema } from '../../schemas';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, useFormContext } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { formatCpf } from 'src/utils/format-string';
import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { getProfissoes } from 'src/api/profissoes/profissoes';
import { ArticlesSelector } from 'src/features/artigos-penais/components/articles-selector';
import { useProfissoesAutocomplete } from 'src/features/empresa-convenios/hooks/use-profissoes-options';
import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { EnderecoForm } from 'src/components/forms/endereco-form';

import {
  getRegimeOptions,
  getEscolaridadeOptions,
  getDisponibilidadeTrabalhoOptions,
} from 'src/types/prisional';

import { detentoService } from '../../data';
import { detentoKeys } from '../../hooks/keys';
import { fichaInativaToCreateFormValues, parseRgOrgaoUf } from '../../helper';
import { FichaDocumentosField } from '../ficha-documentos-field';
import { createDetentoFichaCadastralSchema } from '../../schemas';
import { DetentoFichaInativaSelector } from './detento-ficha-inativa-selector';
import { useGetDetentoFichasInativas } from '../../hooks/use-get-detento-fichas-inativas';
import { useDetentoDetalhesSearchParams } from '../../hooks/use-dentento-detalhes-search-params';

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

// Órgãos expedidores de RG
const ORGAOS_EXPEDIDORES = [
  { value: 'SSP', label: 'SSP - Secretaria de Segurança Pública' },
  { value: 'DIC', label: 'DIC - Diretoria de Identificação Civil' },
  { value: 'PC', label: 'PC - Polícia Civil' },
  { value: 'IFP', label: 'IFP - Instituto Félix Pacheco' },
  { value: 'IGP', label: 'IGP - Instituto Geral de Perícias' },
  { value: 'ITEP', label: 'ITEP - Instituto Técnico-Científico de Perícia' },
  { value: 'SEJUSP', label: 'SEJUSP - Secretaria de Justiça e Segurança Pública' },
  { value: 'SEJSP', label: 'SEJSP - Secretaria de Justiça e Segurança Pública' },
  { value: 'SESP', label: 'SESP - Secretaria de Segurança Pública' },
  { value: 'SESPAP', label: 'SESPAP - Secretaria de Segurança e Administração Penitenciária' },
  { value: 'SESDEC', label: 'SESDEC - Secretaria de Estado de Defesa e Cidadania' },
  { value: 'DETRAN', label: 'DETRAN - Departamento de Trânsito' },
  { value: 'DGPC', label: 'DGPC - Diretoria Geral da Polícia Civil' },
  { value: 'DPMAF', label: 'DPMAF - Divisão de Polícia Marítima, Aérea e de Fronteiras' },
  { value: 'PF', label: 'PF - Polícia Federal' },
  { value: 'DPF', label: 'DPF - Departamento de Polícia Federal' },
  { value: 'PM', label: 'PM - Polícia Militar' },
  { value: 'PTC', label: 'PTC - Polícia Técnico-Científica' },
  { value: 'POLITEC', label: 'POLITEC - Polícia Técnico-Científica' },
];

// Estados brasileiros (UF)
const ESTADOS_BRASILEIROS = [
  { value: 'AC', label: 'AC - Acre' },
  { value: 'AL', label: 'AL - Alagoas' },
  { value: 'AP', label: 'AP - Amapá' },
  { value: 'AM', label: 'AM - Amazonas' },
  { value: 'BA', label: 'BA - Bahia' },
  { value: 'CE', label: 'CE - Ceará' },
  { value: 'DF', label: 'DF - Distrito Federal' },
  { value: 'ES', label: 'ES - Espírito Santo' },
  { value: 'GO', label: 'GO - Goiás' },
  { value: 'MA', label: 'MA - Maranhão' },
  { value: 'MT', label: 'MT - Mato Grosso' },
  { value: 'MS', label: 'MS - Mato Grosso do Sul' },
  { value: 'MG', label: 'MG - Minas Gerais' },
  { value: 'PA', label: 'PA - Pará' },
  { value: 'PB', label: 'PB - Paraíba' },
  { value: 'PR', label: 'PR - Paraná' },
  { value: 'PE', label: 'PE - Pernambuco' },
  { value: 'PI', label: 'PI - Piauí' },
  { value: 'RJ', label: 'RJ - Rio de Janeiro' },
  { value: 'RN', label: 'RN - Rio Grande do Norte' },
  { value: 'RS', label: 'RS - Rio Grande do Sul' },
  { value: 'RO', label: 'RO - Rondônia' },
  { value: 'RR', label: 'RR - Roraima' },
  { value: 'SC', label: 'SC - Santa Catarina' },
  { value: 'SP', label: 'SP - São Paulo' },
  { value: 'SE', label: 'SE - Sergipe' },
  { value: 'TO', label: 'TO - Tocantins' },
];

// Regiões Administrativas do Distrito Federal
const REGIOES_ADMINISTRATIVAS_DF = [
  { value: 'RA I - Brasília', label: 'RA I - Brasília (Plano Piloto)' },
  { value: 'RA II - Gama', label: 'RA II - Gama' },
  { value: 'RA III - Taguatinga', label: 'RA III - Taguatinga' },
  { value: 'RA IV - Brazlândia', label: 'RA IV - Brazlândia' },
  { value: 'RA V - Sobradinho', label: 'RA V - Sobradinho' },
  { value: 'RA VI - Planaltina', label: 'RA VI - Planaltina' },
  { value: 'RA VII - Paranoá', label: 'RA VII - Paranoá' },
  { value: 'RA VIII - Núcleo Bandeirante', label: 'RA VIII - Núcleo Bandeirante' },
  { value: 'RA IX - Ceilândia', label: 'RA IX - Ceilândia' },
  { value: 'RA X - Guará', label: 'RA X - Guará' },
  { value: 'RA XI - Cruzeiro', label: 'RA XI - Cruzeiro' },
  { value: 'RA XII - Samambaia', label: 'RA XII - Samambaia' },
  { value: 'RA XIII - Santa Maria', label: 'RA XIII - Santa Maria' },
  { value: 'RA XIV - São Sebastião', label: 'RA XIV - São Sebastião' },
  { value: 'RA XV - Recanto das Emas', label: 'RA XV - Recanto das Emas' },
  { value: 'RA XVI - Lago Sul', label: 'RA XVI - Lago Sul' },
  { value: 'RA XVII - Riacho Fundo', label: 'RA XVII - Riacho Fundo' },
  { value: 'RA XVIII - Lago Norte', label: 'RA XVIII - Lago Norte' },
  { value: 'RA XIX - Candangolândia', label: 'RA XIX - Candangolândia' },
  { value: 'RA XX - Águas Claras', label: 'RA XX - Águas Claras' },
  { value: 'RA XXI - Riacho Fundo II', label: 'RA XXI - Riacho Fundo II' },
  { value: 'RA XXII - Sudoeste/Octogonal', label: 'RA XXII - Sudoeste/Octogonal' },
  { value: 'RA XXIII - Varjão', label: 'RA XXIII - Varjão' },
  { value: 'RA XXIV - Park Way', label: 'RA XXIV - Park Way' },
  { value: 'RA XXV - SCIA', label: 'RA XXV - SCIA (Estrutural)' },
  { value: 'RA XXVI - Sobradinho II', label: 'RA XXVI - Sobradinho II' },
  { value: 'RA XXVII - Jardim Botânico', label: 'RA XXVII - Jardim Botânico' },
  { value: 'RA XXVIII - Itapoã', label: 'RA XXVIII - Itapoã' },
  { value: 'RA XXIX - SIA', label: 'RA XXIX - SIA' },
  { value: 'RA XXX - Vicente Pires', label: 'RA XXX - Vicente Pires' },
  { value: 'RA XXXI - Fercal', label: 'RA XXXI - Fercal' },
  { value: 'RA XXXII - Sol Nascente/Pôr do Sol', label: 'RA XXXII - Sol Nascente/Pôr do Sol' },
  { value: 'RA XXXIII - Arniqueira', label: 'RA XXXIII - Arniqueira' },
];

type DetentoFichaCadastralDialogFormProps = {
  detento: Detento;
  detentoId: string;
  fichaCadastralId?: string;
  defaultValues?: CreateDetentoFichaCadastralSchema;
  open: boolean;
  onClose: () => void;
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

// Componente interno para campo de profissão com cache de rótulos
type ProfissaoFieldProps = {
  name: string;
  label: string;
  excludeValue?: string;
  onLabelUpdate?: (id: string, nome: string) => void;
};

const ProfissaoField = ({ name, label, excludeValue, onLabelUpdate }: ProfissaoFieldProps) => {
  const [profissaoInput, setProfissaoInput] = useState('');
  const [initialProfissoes, setInitialProfissoes] = useState<any[]>([]);
  const labelCache = useRef<Map<string, string>>(new Map());
  const { watch } = useFormContext();

  const {
    options: profissoes,
    loading: loadingProf,
    hasMinimum: hasMin,
  } = useProfissoesAutocomplete(profissaoInput, 3);

  // Buscar profissão atual do formulário
  const currentProfissaoId = watch(name);

  // Carregar profissões iniciais quando o componente é montado (para modo de edição)
  useEffect(() => {
    if (currentProfissaoId && !labelCache.current.has(String(currentProfissaoId))) {
      const api = getProfissoes();
      // Buscar todas as profissões para encontrar a atual
      api
        .findAll({ page: 1, limit: 100 })
        .then((response) => {
          if (response.items) {
            setInitialProfissoes(response.items);
            // Adicionar todas as profissões ao cache
            response.items.forEach((p: any) => {
              labelCache.current.set(String(p.id), p.nome);
              onLabelUpdate?.(String(p.id), p.nome);
            });
          }
        })
        .catch(() => {
          // Se falhar, manter o ID como fallback
        });
    }
  }, [currentProfissaoId]);

  // Atualizar cache com novas opções da busca
  useEffect(() => {
    profissoes.forEach((p: any) => {
      labelCache.current.set(String(p.id), p.nome);
      onLabelUpdate?.(String(p.id), p.nome);
    });
  }, [profissoes, onLabelUpdate]);

  // Combinar profissões iniciais com as da busca
  const allOptions = useMemo(() => {
    const combined = [...initialProfissoes, ...profissoes];
    // Remover duplicatas baseado no ID
    const unique = combined.filter(
      (p, idx, self) => idx === self.findIndex((t) => String(t.id) === String(p.id))
    );
    return unique.map((p: any) => p.id);
  }, [initialProfissoes, profissoes]);

  const getOptionLabel = (id: unknown) => {
    const idStr = String(id || '');
    return labelCache.current.get(idStr) || idStr;
  };

  return (
    <Field.Autocomplete
      name={name}
      label={label}
      nullToEmptyString
      options={allOptions.filter((id) => !excludeValue || String(id) !== String(excludeValue))}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
      filterSelectedOptions
      loading={loadingProf}
      disablePortal={false}
      onInputChange={(_e: any, value: string) => setProfissaoInput(value)}
      noOptionsText="Procure uma profissão"
      slotProps={{
        textField: {
          helperText:
            !hasMin && (profissaoInput?.length || 0) > 0
              ? 'Digite ao menos 3 caracteres'
              : undefined,
        },
        popper: {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
          ],
        },
      }}
    />
  );
};

export const DetentoFichaCadastralDialogForm = ({
  detento,
  detentoId,
  fichaCadastralId,
  defaultValues,
  open,
  onClose,
}: DetentoFichaCadastralDialogFormProps) => {
  const isEditing = !!fichaCadastralId;
  const queryClient = useQueryClient();
  const [, setSearchParams] = useDetentoDetalhesSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecoverySelector, setShowRecoverySelector] = useState(false);
  const [recoveredFromFicha, setRecoveredFromFicha] = useState<DetentoFichaCadastral | null>(null);
  const disponibilidadeTrabalhoOptions = getDisponibilidadeTrabalhoOptions();

  const { data: fichasInativas = [], isLoading: isLoadingFichasInativas } =
    useGetDetentoFichasInativas(detentoId, {
      enabled: open && !isEditing,
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
        onClose();
        // Keep user on ficha cadastral tab after submit
        setSearchParams({ tab: 'ficha_cadastral' });
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
    if (!open) {
      setShowRecoverySelector(false);
      setRecoveredFromFicha(null);
      return;
    }

    if (!isEditing) {
      if (isLoadingFichasInativas) {
        return;
      }

      if (!isFormDirty) {
        setShowRecoverySelector(fichasInativas.length > 0);
      }
    }
  }, [open, isEditing, fichasInativas.length, isLoadingFichasInativas, isFormDirty]);

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
    } else if (open && !recoveredFromFicha) {
      // Preenche os campos com os dados do detento ao abrir para criar
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
  }, [isEditing, defaultValues, open, detento, methods, unidades, recoveredFromFicha]);

  const shouldShowRecoverySelector =
    open && !isEditing && showRecoverySelector && fichasInativas.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Ficha Cadastral
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preencha os campos abaixo para adicionar uma nova ficha cadastral.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                {/* 1. Identificação Pessoal */}
                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      1. Identificação Pessoal
                    </Typography>
                    {/* Status da Ficha (readonly, alinhado à direita) */}
                    {(() => {
                      const status =
                        (methods.getValues() as any)?.status_validacao ??
                        (defaultValues as any)?.status_validacao;
                      const map: Record<
                        string,
                        {
                          label: string;
                          color: 'default' | 'success' | 'warning' | 'error' | 'info';
                        }
                      > = {
                        VALIDADO: { label: 'Validada', color: 'success' },
                        AGUARDANDO_VALIDACAO: { label: 'Aguardando validação', color: 'info' },
                        REQUER_CORRECAO: { label: 'Requer correção', color: 'warning' },
                        REJEITADA: { label: 'Rejeitada', color: 'error' },
                        FILA_DISPONIVEL: { label: 'Na fila', color: 'info' },
                      };
                      const conf = map[status] || {
                        label: status || '-',
                        color: 'default' as const,
                      };
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Status da Ficha:
                          </Typography>
                          <Chip
                            size="medium"
                            label={conf.label}
                            color={conf.color}
                            variant="soft"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      );
                    })()}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        required
                        name="nome"
                        label="Nome completo"
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Cpf
                        required
                        name="cpf"
                        label="CPF"
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      />
                    </Grid>
                    <Grid size={{ md: 4, sm: 12 }}>
                      <Field.Text required name="rg" label="RG" />
                    </Grid>
                    <Grid size={{ md: 4, sm: 12 }}>
                      <Field.DatePicker
                        name="rg_expedicao"
                        label="Data de expedição do RG*"
                        disableFuture
                      />
                    </Grid>
                    <Grid size={{ md: 2, sm: 6 }}>
                      <Field.Select required name="rg_orgao" label="Órgão expedidor" fullWidth>
                        <MenuItem value="">
                          <em>Órgão</em>
                        </MenuItem>
                        {ORGAOS_EXPEDIDORES.map((orgao) => (
                          <MenuItem key={orgao.value} value={orgao.value}>
                            {orgao.label}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                    <Grid size={{ md: 2, sm: 6 }}>
                      <Field.Select
                        required
                        name="rg_uf"
                        label="UF do RG"
                        fullWidth
                        helperText="Estado emissor"
                      >
                        <MenuItem value="">
                          <em>UF</em>
                        </MenuItem>
                        {ESTADOS_BRASILEIROS.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.value}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                    <Grid size={{ md: 5, sm: 12 }}>
                      <Field.DatePicker
                        name="data_nascimento"
                        label="Data de nascimento*"
                        disableFuture
                        disabled
                        slotProps={{
                          textField: {
                            helperText:
                              'Campo preenchido automaticamente com os dados do cadastro do detento',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ md: 5, sm: 12 }}>
                      <Field.Text required name="naturalidade" label="Naturalidade (Cidade)" />
                    </Grid>
                    <Grid size={{ md: 2, sm: 12 }}>
                      <Field.Select
                        required
                        name="naturalidade_uf"
                        label="UF"
                        fullWidth
                        helperText="Estado de nascimento"
                      >
                        <MenuItem value="">
                          <em>UF</em>
                        </MenuItem>
                        {ESTADOS_BRASILEIROS.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        required
                        name="filiacao_mae"
                        label="Nome da mãe"
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text name="filiacao_pai" label="Nome do pai (ou N/D)" />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* 2. Situação Prisional */}
                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    2. Situação Prisional
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ md: 4, sm: 12 }}>
                      <Field.Select
                        required
                        name="regime"
                        label="Regime"
                        fullWidth
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      >
                        {getRegimeOptions().map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                    <Grid size={{ md: 4, sm: 12 }}>
                      <Field.Select
                        required
                        name="unidade_prisional"
                        label="Unidade prisional"
                        fullWidth
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      >
                        {unidades.map((u) => (
                          <MenuItem key={u.id} value={u.nome}>
                            {u.nome}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                    <Grid size={{ md: 4, sm: 12 }}>
                      <Field.Text
                        name="prontuario"
                        label="Prontuário"
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      />
                    </Grid>
                    <Grid size={{ md: 12, sm: 12 }}>
                      <ArticlesSelector name="artigos_penais" label="Artigos Penais" />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        name="sei"
                        label="Número SEI (processo)"
                        placeholder="Ex: 12345.123456/2024-12"
                        helperText="Digite o número SEI do processo digital"
                        onInput={(e: any) => {
                          const input = e.target;
                          const value = input.value.replace(/\D/g, ''); // Remove não-dígitos
                          let formatted = '';

                          if (value.length <= 5) {
                            // #####
                            formatted = value;
                          } else if (value.length <= 11) {
                            // #####.######
                            formatted = `${value.slice(0, 5)}.${value.slice(5)}`;
                          } else if (value.length <= 15) {
                            // #####.######/####
                            formatted = `${value.slice(0, 5)}.${value.slice(5, 11)}/${value.slice(11)}`;
                          } else {
                            // #####.######/####-##
                            formatted = `${value.slice(0, 5)}.${value.slice(5, 11)}/${value.slice(11, 15)}-${value.slice(15, 17)}`;
                          }

                          input.value = formatted;

                          // Salvar apenas os dígitos no formulário
                          methods.setValue('sei', value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* 3. Endereço e Contato */}
                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    3. Endereço e Contato
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Novo formulário de endereço estruturado */}
                    <Grid size={{ xs: 12 }}>
                      <EnderecoForm disabled={loading} />
                    </Grid>

                    {/* Telefone */}
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        name="telefone"
                        label="Telefone(s)"
                        placeholder="Ex: (61) 99999-9999"
                        onInput={(e: any) => {
                          const input = e.target;
                          const value = input.value.replace(/\D/g, ''); // Remove não-dígitos
                          let formatted = '';

                          if (value.length <= 2) {
                            formatted = value;
                          } else if (value.length <= 6) {
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                          } else if (value.length <= 10) {
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                          } else {
                            // Celular com 9 dígitos
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                          }

                          input.value = formatted;

                          // Salvar apenas os dígitos no formulário
                          methods.setValue('telefone', value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* 4. Escolaridade e Saúde */}
                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    4. Escolaridade e Saúde
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Select
                        required
                        name="escolaridade"
                        label="Escolaridade"
                        fullWidth
                        disabled
                        helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
                      >
                        {getEscolaridadeOptions().map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Switch name="tem_problema_saude" label="Tem problema de saúde?" />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text name="problema_saude" label="Qual(is) problema(s) de saúde?" />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Select
                        name="regiao_bloqueada"
                        label="Região Administrativa onde não pode trabalhar"
                        fullWidth
                        helperText="Selecione a RA onde o detento não pode trabalhar (diferente da região onde pode trabalhar)"
                        onChange={(e: any) => {
                          // Se uma região foi selecionada aqui e ela estava selecionada no campo permitido, limpar o campo permitido
                          const selectedValue = e.target.value;
                          const regiaoPermitida = methods.watch('regiao_administrativa');
                          if (selectedValue && regiaoPermitida === selectedValue) {
                            methods.setValue('regiao_administrativa', '');
                          }
                          methods.setValue('regiao_bloqueada', selectedValue);
                        }}
                      >
                        <MenuItem value="">
                          <em>Selecione uma RA</em>
                        </MenuItem>
                        {REGIOES_ADMINISTRATIVAS_DF.filter((ra) => {
                          const regiaoPermitida = methods.watch('regiao_administrativa');
                          return !regiaoPermitida || ra.value !== regiaoPermitida;
                        }).map((ra) => (
                          <MenuItem key={ra.value} value={ra.value}>
                            {ra.label}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* 5. Experiência e Qualificação */}
                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    5. Experiência e Qualificação
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        name="experiencia_profissional"
                        label="Experiência profissional"
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        name="fez_curso_sistema_prisional"
                        label="Fez curso no sistema prisional? Qual?"
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Autocomplete
                        name="disponibilidade_trabalho"
                        label="Disponibilidade de trabalho"
                        nullToEmptyString
                        options={disponibilidadeTrabalhoOptions.map((option) => option.value)}
                        getOptionLabel={(value) =>
                          disponibilidadeTrabalhoOptions.find((option) => option.value === value)
                            ?.label || String(value || '')
                        }
                        isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Switch name="ja_trabalhou_funap" label="Já trabalhou pela FUNAP?" />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        name="ano_trabalho_anterior"
                        label="Ano do trabalho anterior pela FUNAP"
                        placeholder="Ex: 2024"
                        helperText="Digite o ano no formato AAAA"
                        inputProps={{ maxLength: 4 }}
                        onInput={(e: any) => {
                          const input = e.target;
                          let value = input.value.replace(/\D/g, ''); // Remove não-dígitos

                          // Limitar a 4 dígitos
                          if (value.length > 4) {
                            value = value.slice(0, 4);
                          }

                          input.value = value;
                          methods.setValue('ano_trabalho_anterior', value);
                        }}
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <ProfissaoField
                        name="profissao_01"
                        label="Profissão 01*"
                        excludeValue={methods.watch('profissao_02')}
                        onLabelUpdate={handleLabelUpdate}
                      />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <ProfissaoField
                        name="profissao_02"
                        label="Profissão 02 (opcional)"
                        excludeValue={methods.watch('profissao_01')}
                        onLabelUpdate={handleLabelUpdate}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* 6. Declarações e Responsáveis */}
                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    6. Declarações e Responsáveis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text name="responsavel_preenchimento" label="Nome de quem preencheu" />
                    </Grid>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.DatePicker
                        name="data_assinatura"
                        label="Data da abertura ficha"
                        readOnly
                        slotProps={{
                          textField: {
                            InputProps: {
                              readOnly: true,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
                  <FichaDocumentosField
                    fichaId={fichaCadastralId}
                    detentoId={detentoId}
                    title="7. Documentos anexados*"
                    helperText="Anexe imagens de documentos relevantes e nomeie cada arquivo para facilitar o controle."
                  />
                </Box>

                {/* PDF gerado (upload manual, se necessário) */}
                {/* <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                8. Documento PDF
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ sm: 12 }}>
                  <Field.Upload name="pdf_path" onDelete={handleRemovePdf} />
                </Grid>
              </Grid>
            </Box> */}
              </Box>
            </Form>
          </>
        )}
      </DialogContent>

      {!shouldShowRecoverySelector && (
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} variant="outlined" color="primary" disabled={loading}>
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
        </DialogActions>
      )}
    </Dialog>
  );
};
