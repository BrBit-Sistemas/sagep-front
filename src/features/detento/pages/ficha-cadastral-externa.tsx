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
import { useProfissoesAutocomplete } from '../../empresa-convenios/hooks/use-profissoes-options';

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
    // Sobrescrever regime e escolaridade para aceitar valores dos enums
    regime: z.nativeEnum(Regime, { message: 'Regime é obrigatório' }),
    escolaridade: z.nativeEnum(Escolaridade, { message: 'Escolaridade é obrigatória' }),
  })
  .refine((data) => /^\d{4}-\d{2}-\d{2}$/.test(data.data_nascimento || ''), {
    path: ['data_nascimento'],
    message: 'Data deve estar no formato YYYY-MM-DD',
  });
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

        // Preenche defaults do formulário
        methods.reset({
          ...methods.getValues(),
          detento_id: detento.id,
          nome: detento.nome,
          cpf: detento.cpf,
          prontuario: detento.prontuario,
          data_nascimento: detento.data_nascimento
            ? formatDateToYYYYMMDD(detento.data_nascimento)
            : '',
          regime: detento.regime,
          escolaridade: detento.escolaridade,
          unidade_prisional: getUnidadeName(detento.unidade_id),
          unidade_id: detento.unidade_id,
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

        // Se não houver detento, precisamos criar
        if (!detentoId) {
          // Pre-validação: prontuário único antes de criar detento
          const prontuario = String(data.prontuario || '').trim();
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
          // Mínimo necessário para criar o detento
          // Aqui esperamos que o formulário tenha esses campos preenchidos
          const created = await detentoService.create({
            nome: data.nome,
            prontuario: data.prontuario,
            cpf: data.cpf,
            data_nascimento: formatDateToYYYYMMDD(data.data_nascimento),
            regime: data.regime as any,
            escolaridade: data.escolaridade as any,
            unidade_id: data.unidade_id,
          });
          detentoId = created.id;
          setCreatingDetento(false);
          // Atualiza o form para manter consistência visual
          methods.setValue('detento_id', detentoId);
        }

        // Evita duplicar RG para o mesmo detento
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
        delete (restData as any).unidade_id;
        delete (restData as any).detento_id;
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
                <Typography variant="h6">1. Identificação Pessoal</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="nome" label="Nome completo" />
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
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Text name="rg_orgao_uf" label="Órgão expedidor/UF" />
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
                    <Field.Text
                      name="naturalidade_uf"
                      label="UF de naturalidade"
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          style: { textTransform: 'uppercase' },
                        },
                      }}
                      inputProps={{ maxLength: 2 }}
                      onChange={(e: any) => {
                        const value = e.target.value.toUpperCase().slice(0, 2);
                        e.target.value = value;
                        methods.setValue('naturalidade_uf', value);
                      }}
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="filiacao_mae" label="Nome da mãe" />
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
                    <Field.Text name="sei" label="Número SEI (processo)" />
                  </Grid>
                </Grid>

                <Typography variant="h6">3. Endereço e Contato</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 12, sm: 12 }}>
                    <Field.Text name="endereco" label="Endereço completo" />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="regiao_administrativa" label="Região Administrativa (RA)" />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text name="telefone" label="Telefone(s)" />
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
                    <Field.Text
                      name="regiao_bloqueada"
                      label="Região Administrativa onde não pode trabalhar"
                    />
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
