import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect } from 'react';

import MenuItem from '@mui/material/MenuItem';
import {
  Card,
  Grid,
  Alert,
  Stack,
  Button,
  Dialog,
  Container,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { isValidCpf } from 'src/utils/validate-cpf';
import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { getProfissoes } from 'src/api/profissoes/profissoes';
import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Form, Field } from 'src/components/hook-form';

import { detentoService } from '../data';
import { Regime, Escolaridade } from '../types';
import { createDetentoFichaCadastralSchema } from '../schemas';
import { FichaDocumentosField } from '../components/ficha-documentos-field';
import { useProfissoesAutocomplete } from '../../empresa-convenios/hooks/use-profissoes-options';

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

const externalSchema = createDetentoFichaCadastralSchema
  .extend({
    detento_id: z.string().optional(),
    unidade_prisional: z.string().optional(),
    unidade_id: z
      .string()
      .min(1, { message: 'Unidade prisional é obrigatória' })
      .uuid('ID da unidade prisional inválido'),
    // Permitir null vindo do Autocomplete e normalizar para string vazia
    profissao_01: z.preprocess((v) => (v === null ? '' : v), z.string().optional()),
    profissao_02: z.preprocess((v) => (v === null ? '' : v), z.string().optional()),
    // Campos separados para RG
    rg_orgao: z.string().optional(),
    rg_uf: z.string().optional(),
    // Sobrescrever regime e escolaridade para aceitar valores dos enums
    regime: z.nativeEnum(Regime, { message: 'Regime é obrigatório' }),
    escolaridade: z.nativeEnum(Escolaridade, { message: 'Escolaridade é obrigatória' }),
  })
  .omit({
    rg_orgao_uf: true, // Remove a validação obrigatória do campo combinado
  })
  .extend({
    rg_orgao_uf: z.string().optional(), // Torna o campo combinado opcional
  })
  .refine((data) => /^\d{4}-\d{2}-\d{2}$/.test(data.data_nascimento || ''), {
    path: ['data_nascimento'],
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  .refine(
    (data) => {
      // Validação customizada: pelo menos um dos campos de RG deve estar preenchido
      const hasOrgao = Boolean(data.rg_orgao && data.rg_orgao.trim());
      const hasUf = Boolean(data.rg_uf && data.rg_uf.trim());
      const hasRgOrgaoUf = Boolean(data.rg_orgao_uf && data.rg_orgao_uf.trim());

      return hasRgOrgaoUf || hasOrgao || hasUf;
    },
    {
      message: 'Pelo menos o órgão expedidor ou UF deve ser preenchido',
      path: ['rg_orgao'], // Mostra erro no primeiro campo para melhor UX
    }
  );
type ExternalFichaSchema = z.infer<typeof externalSchema>;

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
        .findAll({ page: 0, limit: 100 })
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
      onInputChange={(_e: any, value: string) => setProfissaoInput(value)}
      noOptionsText="Procure uma profissão"
      slotProps={{
        textField: {
          helperText:
            !hasMin && (profissaoInput?.length || 0) > 0
              ? 'Digite ao menos 3 caracteres'
              : undefined,
        },
      }}
    />
  );
};

export default function FichaCadastralExternaPage() {
  const formatCpfInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 9);
    const part4 = digits.slice(9, 11);
    let out = part1;
    if (part2) out += `.${part2}`;
    if (part3) out += `.${part3}`;
    if (part4) out += `-${part4}`;
    return out;
  };

  const [cpf, setCpf] = useState('');
  const [step, setStep] = useState<'cpf' | 'form'>('cpf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [confirmCpfOpen, setConfirmCpfOpen] = useState(false);
  const [creatingDetento, setCreatingDetento] = useState(false);
  const [updatingDetento, setUpdatingDetento] = useState(false);
  const [creatingFicha, setCreatingFicha] = useState(false);
  const [errorSummary, setErrorSummary] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const methods = useForm<ExternalFichaSchema>({
    // Cast to any to avoid resolver type mismatch from duplicates
    resolver: zodResolver(externalSchema) as any,
    defaultValues: {
      detento_id: '',
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
      regime: undefined,
      unidade_prisional: '',
      prontuario: '',
      sei: '',
      endereco: '',
      regiao_administrativa: '',
      telefone: '',
      escolaridade: undefined,
      tem_problema_saude: false,
      problema_saude: '',
      regiao_bloqueada: '',
      experiencia_profissional: '',
      fez_curso_sistema_prisional: '',
      ja_trabalhou_funap: false,
      ano_trabalho_anterior: '',
      profissao_01: '',
      profissao_02: '',
      responsavel_preenchimento: '',
      assinatura: '',
      data_assinatura: formatDateToYYYYMMDD(new Date()),

      pdf_path: '',
      documentos: [],
    },
  });

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 0,
    limit: 1000,
  });

  // Cache compartilhado de ID -> Nome para profissões (alimentado pelos campos)
  const globalProfissaoLabelCache = useRef<Map<string, string>>(new Map());
  const handleLabelUpdate = (id: string, nome: string) => {
    if (!globalProfissaoLabelCache.current.has(id)) {
      globalProfissaoLabelCache.current.set(id, nome);
    }
  };

  const getUnidadeName = (unidadeId: string) => {
    const unidade = unidades.find((u) => u.id === unidadeId);
    return unidade?.nome || unidadeId;
  };

  const getApiErrorMessage = (err: any): string => {
    try {
      // Axios error shape
      const message = err?.response?.data?.message || err?.message;
      if (Array.isArray(message)) return message.join(' ');
      return message || 'Erro inesperado.';
    } catch {
      return 'Erro inesperado.';
    }
  };

  // Detecta sucesso via query param (?success=1) caso venha de redirecionamento externo
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === '1') {
        setSuccessMessage('Ficha cadastral criada com sucesso!');
        params.delete('success');
        const qs = params.toString();
        const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
        window.history.replaceState({}, '', url);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleBuscarCpf = async () => {
    setError(null);
    setActiveWarning(null);
    setCpfError(null);
    if (!isValidCpf(cpf)) {
      setCpfError('CPF inválido');
      return;
    }
    setLoading(true);
    try {
      // 1) Verificar detento pelo CPF (normalizado)
      const cleanCpf = cpf.replace(/\D/g, '');
      let detentos = await detentoService.paginate({
        page: 0,
        limit: 1,
        search: undefined,
        cpf: cleanCpf,
      });
      let detento = detentos.items?.[0];
      // fallback: tentar com o valor original caso o backend armazene com pontuação
      if (!detento && cleanCpf !== cpf) {
        detentos = await detentoService.paginate({ page: 0, limit: 1, search: undefined, cpf });
        detento = detentos.items?.[0];
      }

      // 2) Se não existir, permanecemos no step de formulário, mas sem detento_id
      // 3) Se existir, checar ficha ativa
      if (detento) {
        const fichas = await detentoService.getFichasCadastrais(detento.id);
        const ativa = fichas.find((f) => f.status === 'ativa');
        if (ativa) {
          setActiveWarning(
            'Já existe uma ficha cadastral ativa para este CPF. Não é possível criar outra.'
          );
          setLoading(false);
          return;
        }

        // Preenche defaults do formulário com dados do detento (editáveis)
        methods.reset({
          ...methods.getValues(),
          detento_id: detento.id,
          nome: detento.nome || '',
          cpf: detento.cpf || '',
          prontuario: detento.prontuario || '',
          data_nascimento: detento.data_nascimento
            ? formatDateToYYYYMMDD(detento.data_nascimento)
            : '',
          regime: detento.regime || undefined,
          escolaridade: detento.escolaridade || undefined,
          unidade_prisional: getUnidadeName(detento.unidade_id),
          unidade_id: detento.unidade_id,
          // Adiciona nome da mãe que existe no detento
          filiacao_mae: detento.mae || '',
        });
      } else {
        // CPF válido mas não encontrado: confirmar antes de prosseguir
        methods.reset({ ...methods.getValues(), cpf });
        setConfirmCpfOpen(true);
        return;
      }

      setStep('form');
    } catch (err) {
      setError(getApiErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const collectErrorMessages = (errs: any): string[] => {
    if (!errs || typeof errs !== 'object') return [];
    const messages: string[] = [];
    for (const key of Object.keys(errs)) {
      const e = (errs as any)[key];
      if (!e) continue;
      if (e.message) messages.push(String(e.message));
      if (typeof e === 'object') messages.push(...collectErrorMessages(e));
    }
    return Array.from(new Set(messages)).filter(Boolean);
  };

  const handleSubmit = methods.handleSubmit(
    async (data: any) => {
      let phase: 'detento' | 'ficha' | null = null;
      setError(null);
      setLoading(true);
      setErrorSummary([]);
      try {
        let detentoId = data.detento_id as string;
        const prontuarioValor = String(data.prontuario || '').trim();

        // Se não houver detento, precisamos criar
        if (!detentoId) {
          // Pre-validação: prontuário único antes de criar detento
          const prontuario = prontuarioValor;
          if (prontuario) {
            const existing = await detentoService.paginate({
              page: 0,
              limit: 1,
              search: prontuario,
            });
            const found = existing.items?.find(
              (d: any) => String(d.prontuario).trim() === prontuario
            );
            if (found) {
              methods.setError('prontuario' as any, {
                type: 'manual',
                message: 'Prontuário não está disponível.',
              });
              throw new Error('Prontuário não está disponível.');
            }
          }
          phase = 'detento';
          setCreatingDetento(true);
          // Dados completos para criar o detento
          const created = await detentoService.create({
            nome: data.nome,
            prontuario: prontuarioValor || undefined,
            cpf: data.cpf,
            data_nascimento: formatDateToYYYYMMDD(data.data_nascimento),
            regime: data.regime as any,
            escolaridade: data.escolaridade as any,
            unidade_id: data.unidade_id,
            mae: data.filiacao_mae, // Campo nome da mãe
          });
          detentoId = created.id;
          setCreatingDetento(false);
          // Atualiza o form para manter consistência visual
          methods.setValue('detento_id', detentoId);
        } else {
          // Se detento já existe, verificar se os dados básicos foram alterados e atualizar
          phase = 'detento';
          setUpdatingDetento(true);

          // Preparar dados para atualização do detento
          const detentoUpdateData: any = {
            nome: data.nome,
            cpf: data.cpf,
            prontuario: prontuarioValor || undefined,
            data_nascimento: formatDateToYYYYMMDD(data.data_nascimento),
            regime: data.regime as any,
            escolaridade: data.escolaridade as any,
            unidade_id: data.unidade_id,
            mae: data.filiacao_mae, // Campo nome da mãe
          };

          // Atualizar o detento com os novos dados
          await detentoService.update(detentoId, detentoUpdateData);
          setUpdatingDetento(false);
        } // Evita duplicar RG para o mesmo detento
        // if (detentoId) {
        //   const fichasDoDetento = await detentoService.getFichasCadastrais(detentoId);
        //   const rgJaExiste = fichasDoDetento.some(
        //     (f) => String(f.rg).trim() === String(data.rg).trim()
        //   );
        //   if (rgJaExiste) {
        //     throw new Error('Já existe uma ficha com o mesmo RG para este detento.');
        //   }
        // }

        phase = 'ficha';
        setCreatingFicha(true);
        const unidadeNome = getUnidadeName(data.unidade_id);
        const restData: any = { ...data };
        if (prontuarioValor) {
          restData.prontuario = prontuarioValor;
        } else {
          delete restData.prontuario;
        }
        // Converter profissao_01 e profissao_02 de ID para nome usando cache (+ fallback API)
        const apiProfissoes = getProfissoes();
        const rawProfissao01 = restData.profissao_01 || '';
        const rawProfissao02 = restData.profissao_02 || '';
        const [resolvedProfissao01, resolvedProfissao02] = await Promise.all([
          rawProfissao01
            ? (() => {
                const cached = globalProfissaoLabelCache.current.get(String(rawProfissao01));
                if (cached) return Promise.resolve(cached);
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
                return apiProfissoes
                  .findOne(String(rawProfissao02))
                  .then((res) => res?.nome || String(rawProfissao02))
                  .catch(() => String(rawProfissao02));
              })()
            : Promise.resolve(''),
        ]);
        restData.profissao_01 = resolvedProfissao01;
        restData.profissao_02 = resolvedProfissao02;

        // Combinar órgão expedidor e UF do RG em um campo só
        const rgOrgao = restData.rg_orgao?.trim() || '';
        const rgUf = restData.rg_uf?.trim() || '';

        // Validação adicional para garantir que pelo menos um campo foi preenchido
        if (!rgOrgao && !rgUf) {
          methods.setError('rg_orgao' as any, {
            type: 'manual',
            message: 'Pelo menos o órgão expedidor ou UF deve ser preenchido',
          });
          return;
        }

        if (rgOrgao && rgUf) {
          restData.rg_orgao_uf = `${rgOrgao}/${rgUf}`;
        } else if (rgOrgao) {
          restData.rg_orgao_uf = rgOrgao;
        } else if (rgUf) {
          restData.rg_orgao_uf = rgUf;
        }

        delete (restData as any).unidade_id;
        delete (restData as any).detento_id;
        delete (restData as any).rg_orgao;
        delete (restData as any).rg_uf;
        await detentoService.createFichaCadastral({
          ...restData,
          unidade_prisional: unidadeNome,
          detento_id: detentoId,
        });
        setCreatingFicha(false);
        methods.reset();
        setStep('cpf');
        setCpf('');
        setSuccessMessage('Ficha cadastral criada com sucesso!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setCreatingDetento(false);
        setUpdatingDetento(false);
        setCreatingFicha(false);
        const message = getApiErrorMessage(err);
        const status = (err as any)?.response?.status;
        if (status === 409) {
          if (phase === 'detento') {
            // Conflitos na criação do detento (CPF/Prontuário)
            if (
              message?.toLowerCase().includes('prontuário') ||
              message?.toLowerCase().includes('prontuario')
            ) {
              methods.setError('prontuario' as any, { type: 'manual', message });
            } else if (message?.toLowerCase().includes('cpf')) {
              methods.setError('cpf' as any, { type: 'manual', message });
            } else {
              setError(message);
            }
            // Mantém usuário no formulário
          } else if (phase === 'ficha') {
            // Conflitos na criação da ficha (ex.: já existe ativa)
            setActiveWarning(message || 'Já existe uma ficha cadastral ativa para este CPF.');
            setStep('cpf');
          } else {
            setError(message);
          }
        } else if (status === 400) {
          // Validações de DTO do backend (exponha no formulário quando possível)
          if (
            message?.toLowerCase().includes('prontuário') ||
            message?.toLowerCase().includes('prontuario')
          ) {
            methods.setError('prontuario' as any, { type: 'manual', message });
          } else if (message?.toLowerCase().includes('unidade')) {
            methods.setError('unidade_id' as any, { type: 'manual', message });
          } else if (message?.toLowerCase().includes('data') || message?.includes('YYYY-MM-DD')) {
            methods.setError('data_nascimento' as any, { type: 'manual', message });
          } else {
            setError(message);
          }
        } else {
          setError(message);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    (invalid) => {
      const messages = collectErrorMessages(invalid);
      setErrorSummary(messages.length ? messages : ['Corrija os campos obrigatórios.']);
    }
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Ficha Cadastral (Acesso Externo)</Typography>

        {step === 'cpf' && (
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                  {successMessage}
                </Alert>
              )}
              <Typography fontSize={20}>
                Informe o CPF do reeducando para iniciar o cadastro.
              </Typography>
              {activeWarning && <Alert severity="warning">{activeWarning}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={cpf}
                    error={Boolean(cpfError)}
                    helperText={cpfError || ''}
                    onKeyDown={(e: any) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBuscarCpf();
                      }
                    }}
                    onChange={(e: any) => {
                      setCpf(formatCpfInput(e.target.value));
                      if (cpfError) setCpfError(null);
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'stretch' }}>
                  <Button
                    sx={{ height: '55px', minHeight: '55px', width: '30%' }}
                    onClick={handleBuscarCpf}
                    variant="contained"
                    disabled={loading || !cpf}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Card>
        )}

        {step === 'form' && (
          <Card sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {creatingDetento && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Criando reeducando...
              </Alert>
            )}
            {updatingDetento && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Atualizando dados do reeducando...
              </Alert>
            )}
            {creatingFicha && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Criando ficha cadastral (gerando PDF)...
              </Alert>
            )}
            <Form methods={methods} onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {errorSummary.length > 0 && (
                  <Alert severity="error">
                    <Stack component="ul" sx={{ m: 0, pl: 3 }}>
                      {errorSummary.slice(0, 6).map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </Stack>
                  </Alert>
                )}
                {methods.getValues('detento_id') && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Importante:</strong> Todos os dados devem corresponder ao reeducando.
                      Você pode editá-los conforme necessário e as alterações serão salvas
                      permanentemente no cadastro do reeducando.
                    </Typography>
                  </Alert>
                )}
                {!methods.getValues('detento_id') && (
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>Atenção:</strong> Preencha todos os campos com os dados corretos do
                      reeducando. Estes dados serão utilizados para criar o cadastro do reeducando
                      no sistema.
                    </Typography>
                  </Alert>
                )}
                <Typography variant="h6">1. Identificação Pessoal</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="nome"
                      label="Nome completo"
                      helperText={
                        methods.getValues('detento_id')
                          ? 'Campo editável - alterações serão salvas no cadastro do reeducando'
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Cpf name="cpf" label="CPF" />
                  </Grid>
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Text name="rg" label="RG" />
                  </Grid>
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.DatePicker
                      name="rg_expedicao"
                      label="Data de expedição do RG"
                      disableFuture
                    />
                  </Grid>
                  <Grid size={{ md: 2, sm: 6 }}>
                    <Field.Select name="rg_orgao" label="Órgão expedidor" fullWidth>
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
                      name="rg_uf"
                      label="UF do RG"
                      fullWidth
                      helperText="Estado emissor"
                    >
                      <MenuItem value="">
                        <em>Selecione UF</em>
                      </MenuItem>
                      {ESTADOS_BRASILEIROS.map((estado) => (
                        <MenuItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.DatePicker
                      name="data_nascimento"
                      label="Data de nascimento"
                      views={['day', 'month', 'year']}
                      format="DD/MM/YYYY"
                      disableFuture
                      slotProps={{
                        textField: {
                          placeholder: 'DD/MM/YYYY',
                          inputProps: { inputMode: 'numeric', pattern: '\\d{4}-\\d{2}-\\d{2}' },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="naturalidade" label="Naturalidade (Cidade)" />
                  </Grid>
                  <Grid size={{ md: 2, sm: 12 }}>
                    <Field.Select name="naturalidade_uf" label="UF de naturalidade" fullWidth>
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
                      name="filiacao_mae"
                      label="Nome da mãe"
                      helperText={
                        methods.getValues('detento_id')
                          ? 'Campo editável - alterações serão salvas no cadastro do reeducando'
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="filiacao_pai" label="Nome do pai (ou N/D)" />
                  </Grid>
                </Grid>

                <Typography variant="h6">2. Situação Prisional</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Select name="regime" label="Regime" fullWidth>
                      {Object.values(Regime).map((regime) => (
                        <MenuItem key={regime} value={regime}>
                          {regime}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Select name="unidade_id" label="Unidade prisional" fullWidth>
                      {unidades.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.nome}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Text name="prontuario" label="Prontuário" />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="sei"
                      label="Número SEI (processo)"
                      placeholder="Ex: 12345.123456/2024-12"
                      helperText="Digite o número SEI do processo digital"
                      onInput={(e: any) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 17) value = value.slice(0, 17);

                        let formatted = '';
                        if (value.length > 0) {
                          formatted = value.slice(0, 5);
                          if (value.length >= 6) {
                            formatted += '.' + value.slice(5, 11);
                            if (value.length >= 12) {
                              formatted += '/' + value.slice(11, 15);
                              if (value.length >= 16) {
                                formatted += '-' + value.slice(15, 17);
                              }
                            }
                          }
                        }

                        e.target.value = formatted;
                        methods.setValue('sei', formatted);
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6">3. Endereço e Contato</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 12, sm: 12 }}>
                    <Field.Text
                      name="endereco"
                      label="Endereço completo"
                      placeholder="Ex: Rua das Flores, 123, Apt 45, Bairro Centro"
                      helperText="Digite o endereço completo em uma linha (rua, número, complemento, bairro)"
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Select
                      name="regiao_administrativa"
                      label="Região Administrativa onde pode trabalhar"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Selecione uma região</em>
                      </MenuItem>
                      {REGIOES_ADMINISTRATIVAS_DF.filter(
                        (regiao) => regiao.value !== methods.watch('regiao_bloqueada')
                      ).map((regiao) => (
                        <MenuItem key={regiao.value} value={regiao.value}>
                          {regiao.label}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="telefone"
                      label="Telefone(s)"
                      placeholder="Ex: (61) 99999-9999"
                      onInput={(e: any) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 11) value = value.slice(0, 11);

                        let formatted = '';
                        if (value.length > 0) {
                          formatted = '(' + value.slice(0, 2);
                          if (value.length >= 3) {
                            formatted += ') ' + value.slice(2, 7);
                            if (value.length >= 8) {
                              formatted += '-' + value.slice(7, 11);
                            }
                          }
                        }

                        e.target.value = formatted;
                        methods.setValue('telefone', formatted);
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6">4. Escolaridade e Saúde</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Select name="escolaridade" label="Escolaridade" fullWidth>
                      {Object.values(Escolaridade).map((escolaridade) => (
                        <MenuItem key={escolaridade} value={escolaridade}>
                          {escolaridade}
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
                    >
                      <MenuItem value="">
                        <em>Selecione uma região</em>
                      </MenuItem>
                      {REGIOES_ADMINISTRATIVAS_DF.filter(
                        (regiao) => regiao.value !== methods.watch('regiao_administrativa')
                      ).map((regiao) => (
                        <MenuItem key={regiao.value} value={regiao.value}>
                          {regiao.label}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                </Grid>

                <Typography variant="h6">5. Experiência e Qualificação</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="experiencia_profissional" label="Experiência profissional" />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="fez_curso_sistema_prisional"
                      label="Fez curso no sistema prisional? Qual?"
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
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 4) value = value.slice(0, 4);
                        e.target.value = value;
                        methods.setValue('ano_trabalho_anterior', value);
                      }}
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <ProfissaoField
                      name="profissao_01"
                      label="Profissão 01"
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

                <Typography variant="h6">6. Declarações e Responsáveis</Typography>
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

                <FichaDocumentosField
                  detentoId={methods.watch('detento_id')}
                  title="7. Documentos anexados"
                  helperText="Envie imagens legíveis e nomeie cada documento para facilitar a conferência pela equipe."
                />

                <Stack direction="row" spacing={2}>
                  <Button onClick={() => setStep('cpf')} variant="outlined">
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || creatingDetento}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Salvando...' : 'Salvar ficha cadastral'}
                  </Button>
                </Stack>
              </Stack>
            </Form>
          </Card>
        )}

        <Dialog open={confirmCpfOpen} onClose={() => setConfirmCpfOpen(false)}>
          <DialogTitle>Confirmar CPF</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Não encontramos um reeducando com o CPF informado ({cpf}). Deseja prosseguir e
              cadastrar o reeducando com as informações preenchidas no formulário?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmCpfOpen(false)} variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setConfirmCpfOpen(false);
                setStep('form');
              }}
              variant="contained"
            >
              Prosseguir
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}
