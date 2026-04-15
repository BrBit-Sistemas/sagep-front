import type { FieldErrors } from 'react-hook-form';

import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon as SearchIconify } from '@iconify/react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useForm, useWatch, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';
import { formatCepFromStorage } from 'src/utils/input-masks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { enderecoApiService } from 'src/services/endereco-api.service';
import { ArticlesSelector } from 'src/features/artigos-penais/components/articles-selector';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EnderecoSearchDialog } from 'src/components/forms/endereco-search-dialog';

import { regimesOptions } from '../data';
import { useEmpresasOptions } from '../hooks/use-empresas-options';
import { useCreateEmpresaConvenio } from '../hooks/use-create-empresa-convenio';
import { useEmpresaConvenioDetail } from '../hooks/use-empresa-convenio-detail';
import { useUpdateEmpresaConvenio } from '../hooks/use-update-empresa-convenio';
import { ConvenioProfissaoAutocomplete } from '../components/convenio-profissao-autocomplete';
import {
  useTemplateContratosCatalog,
  useTabelasProdutividadeCatalog,
} from '../hooks/use-convenio-contrato-catalog';
import {
  buildEmpresaConvenioSchema,
  type CreateEmpresaConvenioSchema,
  type CreateEmpresaConvenioFormValues,
} from '../schemas';
import {
  defaultResponsaveisForm,
  empresaConvenioToFormValues,
  defaultDistribuicaoProfissoesForm,
  clearEmpresaConvenioFieldsHiddenByTemplate,
} from '../helper';

type TabValue = 'geral' | 'remuneracao' | 'responsaveis' | 'locais' | 'profissoes';

const INITIAL_VALUES: CreateEmpresaConvenioFormValues = {
  empresa_id: '',
  modalidade_execucao: 'INTRAMUROS',
  regimes_permitidos: [],
  artigos_vedados: [],
  max_reeducandos: undefined,
  permite_variacao_quantidade: true,
  tipo_calculo_remuneracao: 'MENSAL',
  usa_nivel: true,
  valor_nivel_i: undefined,
  valor_nivel_ii: undefined,
  valor_nivel_iii: undefined,
  transporte_responsavel: 'FUNAP',
  alimentacao_responsavel: 'FUNAP',
  valor_transporte: 0,
  valor_alimentacao: 0,
  beneficio_variavel_por_dia: true,
  observacao_beneficio: '',
  quantidade_nivel_i: undefined,
  quantidade_nivel_ii: undefined,
  quantidade_nivel_iii: undefined,
  permite_bonus_produtividade: false,
  bonus_produtividade_descricao: '',
  bonus_produtividade_tabela_json_raw: '',
  percentual_gestao: undefined,
  percentual_contrapartida: undefined,
  locais_execucao: [],
  data_inicio: formatDateToYYYYMMDD(new Date()),
  data_fim: null,
  observacoes: '',
  numero_contrato_sequencial: '',
  ano_contrato: String(new Date().getFullYear()),
  processo_sei: '',
  doc_sei: '',
  siggo_numero: '',
  template_contrato_id: '',
  jornada_tipo: '',
  carga_horaria_semanal: undefined,
  escala: '',
  horario_inicio: null,
  horario_fim: null,
  possui_seguro_acidente: false,
  tipo_cobertura_seguro: '',
  observacao_seguro: '',
  observacao_juridica: '',
  clausula_adicional: '',
  descricao_complementar_objeto: '',
  observacao_operacional: '',
  tabela_produtividade_id: '',
  responsaveis: defaultResponsaveisForm(),
  distribuicao_profissoes: defaultDistribuicaoProfissoesForm(),
};

const TAB_GERAL_FIELDS: (keyof CreateEmpresaConvenioFormValues)[] = [
  'empresa_id',
  'template_contrato_id',
  'modalidade_execucao',
  'regimes_permitidos',
  'artigos_vedados',
  'data_inicio',
  'data_fim',
  'observacoes',
  'numero_contrato_sequencial',
  'ano_contrato',
  'processo_sei',
  'doc_sei',
  'siggo_numero',
  'jornada_tipo',
  'carga_horaria_semanal',
  'escala',
  'horario_inicio',
  'horario_fim',
  'observacao_juridica',
  'clausula_adicional',
  'descricao_complementar_objeto',
  'observacao_operacional',
];

const TAB_REMUNERACAO_FIELDS: (keyof CreateEmpresaConvenioFormValues)[] = [
  'tipo_calculo_remuneracao',
  'usa_nivel',
  'valor_nivel_i',
  'valor_nivel_ii',
  'valor_nivel_iii',
  'transporte_responsavel',
  'alimentacao_responsavel',
  'valor_transporte',
  'valor_alimentacao',
  'beneficio_variavel_por_dia',
  'observacao_beneficio',
  'permite_bonus_produtividade',
  'bonus_produtividade_descricao',
  'bonus_produtividade_tabela_json_raw',
  'tabela_produtividade_id',
  'percentual_gestao',
  'percentual_contrapartida',
  'possui_seguro_acidente',
  'tipo_cobertura_seguro',
  'observacao_seguro',
];

const TAB_RESPONSAVEIS_FIELDS: (keyof CreateEmpresaConvenioFormValues)[] = ['responsaveis'];

const TAB_PROFISSOES_FIELDS: (keyof CreateEmpresaConvenioFormValues)[] = [
  'max_reeducandos',
  'permite_variacao_quantidade',
  'distribuicao_profissoes',
  'quantidade_nivel_i',
  'quantidade_nivel_ii',
  'quantidade_nivel_iii',
];

const LocalExecucaoRow = ({ idx, onRemove }: { idx: number; onRemove: () => void }) => {
  const { setValue, control } = useFormContext();
  const [loadingCep, setLoadingCep] = useState(false);
  const [errorCep, setErrorCep] = useState<string | null>(null);
  const [openBusca, setOpenBusca] = useState(false);

  const cep: string = useWatch({ control, name: `locais_execucao.${idx}.cep` as const }) as string;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    if (onlyDigits.length < 8) {
      setValue(`locais_execucao.${idx}.logradouro`, '');
      setValue(`locais_execucao.${idx}.numero`, '');
      setValue(`locais_execucao.${idx}.complemento`, '');
      setValue(`locais_execucao.${idx}.bairro`, '');
      setValue(`locais_execucao.${idx}.cidade`, '');
      setValue(`locais_execucao.${idx}.estado`, '');
    }
  };

  useEffect(() => {
    const onlyDigits = (cep || '').replace(/\D/g, '');
    if (onlyDigits.length === 8) {
      (async () => {
        try {
          setLoadingCep(true);
          setErrorCep(null);
          const dados = await enderecoApiService.buscarCep(onlyDigits);
          setValue(`locais_execucao.${idx}.logradouro`, dados.logradouro || '');
          setValue(`locais_execucao.${idx}.bairro`, dados.bairro || '');
          setValue(`locais_execucao.${idx}.cidade`, dados.cidade || '');
          setValue(`locais_execucao.${idx}.estado`, dados.estado || '');
        } catch {
          const formattedCep = `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5)}`;
          setErrorCep(`CEP ${formattedCep} não encontrado`);
        } finally {
          setLoadingCep(false);
        }
      })();
    } else if (onlyDigits.length > 0 && onlyDigits.length < 8) {
      setErrorCep('CEP incompleto');
      setLoadingCep(false);
    } else if (onlyDigits.length === 0) {
      setErrorCep(null);
      setLoadingCep(false);
    }
  }, [cep, idx, setValue]);

  const handleSelecionarCep = (cepSel: string) => {
    setValue(`locais_execucao.${idx}.cep`, formatCepFromStorage(cepSel));
    setOpenBusca(false);
  };

  return (
    <Box>
      <Grid
        container
        spacing={1}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2,
          mb: 2,
        }}
      >
        <Grid size={{ md: 3, sm: 6 }}>
          <Field.Text
            name={`locais_execucao.${idx}.cep`}
            label="CEP"
            placeholder="00000-000"
            maskPreset="cep"
            onChange={handleCepChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loadingCep ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Tooltip title="Buscar CEP por endereço">
                      <span>
                        <IconButton size="small" onClick={() => setOpenBusca(true)}>
                          <SearchIconify icon="solar:magnifer-linear" width={16} height={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </InputAdornment>
              ),
            }}
            helperText={!errorCep && 'Ou busque pelo endereço'}
          />
        </Grid>
        <Grid size={{ md: 5, sm: 12 }}>
          <Field.Text
            name={`locais_execucao.${idx}.logradouro`}
            label="Logradouro"
            placeholder="Av. Brasil"
          />
        </Grid>
        <Grid size={{ md: 2, sm: 6 }}>
          <Field.Text name={`locais_execucao.${idx}.numero`} label="Número" placeholder="123" />
        </Grid>
        <Grid size={{ md: 2, sm: 6 }}>
          <Field.Text
            name={`locais_execucao.${idx}.complemento`}
            label="Complemento"
            placeholder="Galpão, sala..."
          />
        </Grid>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.Text name={`locais_execucao.${idx}.bairro`} label="Bairro" />
        </Grid>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.Text
            name={`locais_execucao.${idx}.cidade`}
            label="Cidade"
            placeholder="Boa Vista"
          />
        </Grid>
        <Grid size={{ md: 2, sm: 6 }}>
          <Field.Text
            name={`locais_execucao.${idx}.estado`}
            label="UF"
            placeholder="RR"
            maskPreset="uf"
          />
        </Grid>
        <Grid size={{ md: 10, sm: 12 }}>
          <Field.Text
            name={`locais_execucao.${idx}.referencia`}
            label="Referência"
            placeholder="Ponto de referência"
          />
        </Grid>
        <Grid size={{ md: 2, sm: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="error" variant="outlined" onClick={onRemove}>
            Remover local
          </Button>
        </Grid>
      </Grid>
      {errorCep && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          {errorCep}
        </Alert>
      )}
      <EnderecoSearchDialog
        open={openBusca}
        onClose={() => setOpenBusca(false)}
        onSelectCep={handleSelecionarCep}
      />
    </Box>
  );
};

const tabNav = [
  { value: 'geral' as const, label: 'Geral', icon: <Iconify icon="solar:list-bold" /> },
  {
    value: 'remuneracao' as const,
    label: 'Remuneração e benefícios',
    icon: <Iconify icon="solar:wad-of-money-bold" />,
  },
  {
    value: 'responsaveis' as const,
    label: 'Responsáveis',
    icon: <Iconify icon="solar:user-id-bold" />,
  },
  {
    value: 'locais' as const,
    label: 'Locais de execução',
    icon: <Iconify icon="solar:flag-bold" />,
  },
  {
    value: 'profissoes' as const,
    label: 'Profissões / vagas',
    icon: <Iconify icon="solar:users-group-rounded-bold" />,
  },
];

const currentYear = new Date().getFullYear();
const anoContratoOptions = Array.from({ length: 11 }, (_, idx) => String(currentYear - 5 + idx));

function selectTabForErrors(errors: FieldErrors<CreateEmpresaConvenioFormValues>): TabValue {
  if (TAB_GERAL_FIELDS.some((k) => errors[k] != null)) return 'geral';
  if (TAB_REMUNERACAO_FIELDS.some((k) => errors[k] != null)) return 'remuneracao';
  if (TAB_RESPONSAVEIS_FIELDS.some((k) => errors[k] != null)) return 'responsaveis';
  if (errors.locais_execucao != null) return 'locais';
  if (TAB_PROFISSOES_FIELDS.some((k) => errors[k] != null)) return 'profissoes';
  return 'geral';
}

function collectErrorMessages(obj: unknown, seen = new Set<string>()): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const msgs: string[] = [];
  const record = obj as Record<string, unknown>;
  if (typeof record.message === 'string' && record.message && !seen.has(record.message)) {
    seen.add(record.message);
    msgs.push(record.message);
  }
  for (const val of Object.values(record)) {
    if (val && typeof val === 'object' && val !== obj) {
      msgs.push(...collectErrorMessages(val, seen));
    }
  }
  return msgs;
}

export default function EmpresaConvenioFormPage() {
  const { convenioId } = useParams<{ convenioId: string }>();
  const navigate = useNavigate();
  const isEditing = !!convenioId;
  const { data: existing, isLoading: loadingDetail } = useEmpresaConvenioDetail(
    isEditing ? convenioId : undefined
  );
  const { mutateAsync: createItem, isPending: isCreating } = useCreateEmpresaConvenio();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateEmpresaConvenio();
  const { data: templates, isLoading: loadingTemplates } = useTemplateContratosCatalog();
  const { data: tabelasProd, isLoading: loadingTabelasProd } = useTabelasProdutividadeCatalog();
  const [tab, setTab] = useState<TabValue>('geral');

  const isSaving = isEditing ? isUpdating : isCreating;
  const { options: empresaOptions, indexMap: empresasIndex } = useEmpresasOptions('');

  const validationSchema = useMemo(() => buildEmpresaConvenioSchema(templates ?? []), [templates]);

  const methods = useForm<CreateEmpresaConvenioFormValues, unknown, CreateEmpresaConvenioSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: INITIAL_VALUES,
    shouldUnregister: false,
  });

  const empresaIdWatch = useWatch({ control: methods.control, name: 'empresa_id' });
  const empresaNome = empresaIdWatch ? empresasIndex.get(empresaIdWatch) : undefined;
  const templateIdWatch = useWatch({ control: methods.control, name: 'template_contrato_id' });
  const permiteBonusWatch = useWatch({
    control: methods.control,
    name: 'permite_bonus_produtividade',
  });
  const qNivelI = useWatch({ control: methods.control, name: 'quantidade_nivel_i' });
  const qNivelII = useWatch({ control: methods.control, name: 'quantidade_nivel_ii' });
  const qNivelIII = useWatch({ control: methods.control, name: 'quantidade_nivel_iii' });
  const usaNivelWatch = useWatch({ control: methods.control, name: 'usa_nivel' });
  const distribuicaoWatch = useWatch({ control: methods.control, name: 'distribuicao_profissoes' });
  const maxReedWatch = useWatch({ control: methods.control, name: 'max_reeducandos' });
  const possuiSeguroWatch = useWatch({
    control: methods.control,
    name: 'possui_seguro_acidente',
  });
  const templateCodigo = templates?.find((t) => t.template_contrato_id === templateIdWatch)?.codigo;
  const isTemplateGdf = templateCodigo === 'PADRAO_ORGAO_PUBLICO_GDF';
  const isTemplateIntramuros = templateCodigo === 'PADRAO_INTRAMUROS';
  const num = (v: unknown): number => {
    if (v === '' || v === null || v === undefined) return 0;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? 0 : n;
  };
  const somaNiveis = num(qNivelI) + num(qNivelII) + num(qNivelIII);
  const maxR = maxReedWatch != null && maxReedWatch !== '' ? Number(maxReedWatch) : NaN;
  const ultrapassaNivel = isTemplateGdf && !Number.isNaN(maxR) && maxR > 0 && somaNiveis > maxR;

  const {
    fields: locaisFields,
    append: appendLocal,
    remove: removeLocal,
  } = useFieldArray({
    name: 'locais_execucao',
    control: methods.control,
  });

  const {
    fields: distFields,
    append: appendDist,
    remove: removeDist,
  } = useFieldArray({
    name: 'distribuicao_profissoes',
    control: methods.control,
  });

  const catalogPrefilledRef = useRef(false);
  const prevTemplateIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    prevTemplateIdRef.current = undefined;
    if (isEditing && existing) {
      methods.reset(empresaConvenioToFormValues(existing));
      catalogPrefilledRef.current = true;
    }
    if (!isEditing) {
      methods.reset(INITIAL_VALUES);
      catalogPrefilledRef.current = false;
    }
  }, [isEditing, existing, methods]);

  useEffect(() => {
    if (isEditing || catalogPrefilledRef.current) return;
    const t0 = templates?.[0]?.template_contrato_id;
    if (t0) {
      methods.setValue('template_contrato_id', t0);
      catalogPrefilledRef.current = true;
    }
  }, [isEditing, templates, methods]);

  useEffect(() => {
    if (!permiteBonusWatch) {
      methods.setValue('tabela_produtividade_id', '');
    }
  }, [permiteBonusWatch, methods]);

  useEffect(() => {
    if (!templates?.length || !templateIdWatch) return;
    const cod = templates.find((t) => t.template_contrato_id === templateIdWatch)?.codigo;
    const prevId = prevTemplateIdRef.current;
    if (prevId !== undefined && prevId !== templateIdWatch) {
      clearEmpresaConvenioFieldsHiddenByTemplate(cod, methods);
    }
    prevTemplateIdRef.current = templateIdWatch;
  }, [templates, templateIdWatch, methods]);

  const catalogLoading = loadingTemplates || loadingTabelasProd;
  const catalogEmpty = !catalogLoading && !templates?.length;

  const somaDistProf = (distribuicaoWatch ?? []).reduce((s, row) => {
    const pid = row?.profissao_id != null ? String(row.profissao_id).trim() : '';
    if (!pid) return s;
    return s + num(row?.quantidade);
  }, 0);
  const somaDistNivel = (nivel: 'I' | 'II' | 'III'): number =>
    (distribuicaoWatch ?? []).reduce((s, row) => {
      const pid = row?.profissao_id != null ? String(row.profissao_id).trim() : '';
      if (!pid) return s;
      const nv = row?.nivel === '' || row?.nivel == null ? null : row?.nivel;
      if (nv !== nivel) return s;
      return s + num(row?.quantidade);
    }, 0);
  const ultrapassaDistProf = !Number.isNaN(maxR) && maxR > 0 && somaDistProf > maxR;

  useEffect(() => {
    void methods.trigger('distribuicao_profissoes');
  }, [somaDistProf, maxReedWatch, methods]);

  const onSubmit = async (data: CreateEmpresaConvenioSchema) => {
    try {
      if (isEditing && convenioId) {
        await updateItem({ convenioId, ...data });
        navigate(paths.empresaConvenios.contratoPreview(convenioId));
      } else {
        const created = await createItem(data);
        navigate(paths.empresaConvenios.contratoPreview(created.id));
      }
    } catch {
      // erro já exibido pelo onError do hook (toast)
    }
  };

  const onInvalid = (errors: FieldErrors<CreateEmpresaConvenioFormValues>) => {
    setTab(selectTabForErrors(errors));
    const messages = collectErrorMessages(errors);
    if (messages.length === 0) {
      toast.error('Preencha todos os campos obrigatórios antes de salvar.');
    } else if (messages.length === 1) {
      toast.error(messages[0]);
    } else {
      toast.error(messages[0], {
        description: messages.slice(1).join(' • '),
      });
    }
  };

  const handleSaveAll = () => {
    void methods.handleSubmit(onSubmit, onInvalid)();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    setTab(newValue);
  };

  if (isEditing && loadingDetail) {
    return <LoadingScreen />;
  }

  const title = isEditing ? 'Editar convênio' : 'Novo convênio';
  const coverUrl = `${CONFIG.assetsDir}/assets/background/detento-banner.webp`;

  const saveFooter = (
    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
      <Button
        type="button"
        variant="outlined"
        color="inherit"
        onClick={() => navigate(paths.empresaConvenios.root)}
      >
        Voltar
      </Button>
      <Button type="submit" variant="contained" disabled={isSaving || catalogEmpty}>
        Salvar
      </Button>
    </Stack>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title}
        links={[
          { name: 'Laboral' },
          { name: 'Convênios', href: paths.empresaConvenios.root },
          { name: title },
        ]}
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:file-text-bold" />}
            onClick={handleSaveAll}
            disabled={isSaving || catalogEmpty}
          >
            Criar contrato
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSaveAll}>
        <Card sx={{ position: 'relative', mb: 3 }}>
          <Box
            sx={{
              height: { xs: 140, md: 180 },
              backgroundImage: `linear-gradient(rgba(0,40,80,0.75), rgba(0,40,80,0.85)), url(${coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: 3,
            }}
          >
            <Typography variant="h4" sx={{ color: 'common.white', mb: 0.5 }}>
              {title}
            </Typography>
            {(empresaNome || isEditing) && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {empresaNome || 'Selecione a empresa na aba Geral'}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 1,
              px: { xs: 1, md: 2 },
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              allowScrollButtonsMobile
            >
              {tabNav.map((item) => (
                <Tab key={item.value} value={item.value} label={item.label} icon={item.icon} />
              ))}
            </Tabs>
          </Box>
        </Card>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2" component="div">
            Campos com asterisco na frente são obrigatórios e devem ser preenchidos. Ao salvar, o
            sistema envia e valida todas as abas.
          </Typography>
        </Alert>

        {catalogEmpty && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cadastre templates de contrato (migrations / seed) para habilitar o seletor de modelo.
          </Alert>
        )}

        <Box sx={{ display: tab === 'geral' ? 'block' : 'none' }}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="empresa_id"
                label="Empresa"
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: { transform: 'translate(14px, -6px) scale(0.75)' },
                  },
                  select: { displayEmpty: true },
                }}
              >
                {empresaOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Select
                name="template_contrato_id"
                label="Template contratual"
                required
                disabled={catalogLoading || catalogEmpty}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {(templates ?? []).map((t) => (
                  <MenuItem key={t.template_contrato_id} value={t.template_contrato_id}>
                    {t.nome} ({t.codigo})
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select required name="modalidade_execucao" label="Modalidade de execução">
                <MenuItem value="INTRAMUROS">Intramuros</MenuItem>
                <MenuItem value="EXTRAMUROS">Extramuros</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Divider sx={{ mt: 1, mb: 2, width: '100%' }} />
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Identificação do instrumento
              </Typography>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="numero_contrato_sequencial"
                label="Número do contrato (sequencial)"
                placeholder="03"
                maskPreset="positiveInt3"
                helperText="O formato final será número/ano (ex.: 03/2026)."
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select name="ano_contrato" label="Ano do contrato" required>
                {anoContratoOptions.map((ano) => (
                  <MenuItem key={ano} value={ano}>
                    {ano}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="processo_sei"
                label="Processo SEI"
                placeholder="00138-00000894/2024-40"
              />
            </Grid>
            <Grid size={{ md: 3, sm: 6 }}>
              <Field.Text name="doc_sei" label="Doc. SEI" placeholder="190496380" />
            </Grid>
            <Grid size={{ md: 3, sm: 6 }}>
              <Field.Text name="siggo_numero" label="SIGGO" placeholder="054458" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.MultiSelect
                name="regimes_permitidos"
                required
                label="Regimes permitidos"
                options={regimesOptions}
                fullWidth
                checkbox
                chip
                placeholder="Selecione..."
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <ArticlesSelector name="artigos_vedados" label="Artigos vedados" />
            </Grid>
            {isTemplateIntramuros ? (
              <Grid size={{ md: 12, sm: 12 }}>
                <Divider sx={{ mt: 4, mb: 4, width: '100%' }} />
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Jornada e horários
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="jornada_tipo"
                      label="Tipo de jornada"
                      placeholder="Ex.: 44h semanais"
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="carga_horaria_semanal"
                      label="Carga horária semanal (h)"
                      maskPreset="positiveInt3"
                      placeholder="168"
                      helperText="1 a 168 h"
                    />
                  </Grid>
                  <Grid size={{ md: 6, sm: 12 }}>
                    <Field.Text
                      name="escala"
                      label="Escala"
                      placeholder="Ex.: 12x36"
                      maskPreset="escalaTurnos"
                      helperText="Ex.: 12x36 (até 3 dígitos de cada lado)"
                    />
                  </Grid>
                  <Grid size={{ md: 3, sm: 6 }}>
                    <Field.Text
                      name="horario_inicio"
                      label="Horário início (HH:MM)"
                      placeholder="06:30"
                      maskPreset="timeHm"
                    />
                  </Grid>
                  <Grid size={{ md: 3, sm: 6 }}>
                    <Field.Text
                      name="horario_fim"
                      label="Horário fim (HH:MM)"
                      placeholder="18:30"
                      maskPreset="timeHm"
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_inicio" label="Data início" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_fim" label="Data fim" />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text name="observacoes" label="Observações gerais" multiline rows={2} />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Divider sx={{ mt: 4, mb: 4, width: '100%' }} />
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Textos complementares (contrato / PDF futuro)
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text
                    name="observacao_juridica"
                    label="Observação jurídica"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text
                    name="clausula_adicional"
                    label="Cláusula adicional"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text
                    name="descricao_complementar_objeto"
                    label="Descrição complementar do objeto"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text
                    name="observacao_operacional"
                    label="Observação operacional"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {saveFooter}
        </Box>

        <Box sx={{ display: tab === 'remuneracao' ? 'block' : 'none' }}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="tipo_calculo_remuneracao"
                label="Tipo de cálculo da remuneração"
                required
              >
                <MenuItem value="MENSAL">Mensal</MenuItem>
                <MenuItem value="HORA">Por hora</MenuItem>
                <MenuItem value="HIBRIDO">Híbrido</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Field.Switch name="usa_nivel" label="Usa níveis I, II e III" />
            </Grid>
            {usaNivelWatch ? (
              <>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text
                    name="valor_nivel_i"
                    label="Valor bolsa — nível I"
                    type="number"
                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text
                    name="valor_nivel_ii"
                    label="Valor bolsa — nível II"
                    type="number"
                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text
                    name="valor_nivel_iii"
                    label="Valor bolsa — nível III"
                    type="number"
                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  />
                </Grid>
              </>
            ) : null}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select name="transporte_responsavel" label="Transporte — responsável" required>
                <MenuItem value="FUNAP">FUNAP</MenuItem>
                <MenuItem value="EMPRESA">Empresa (contratante)</MenuItem>
                <MenuItem value="NENHUM">Não aplicável</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="alimentacao_responsavel"
                label="Alimentação — responsável"
                required
              >
                <MenuItem value="FUNAP">FUNAP</MenuItem>
                <MenuItem value="EMPRESA">Empresa (contratante)</MenuItem>
                <MenuItem value="NENHUM">Não aplicável</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="valor_transporte"
                label="Valor transporte"
                type="number"
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="valor_alimentacao"
                label="Valor alimentação"
                type="number"
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Field.Switch
                name="beneficio_variavel_por_dia"
                label="Benefício variável conforme dias trabalhados"
              />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text
                name="observacao_beneficio"
                label="Observação sobre benefícios"
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Field.Switch
                name="permite_bonus_produtividade"
                label="Permite bônus por produtividade"
              />
            </Grid>
            {permiteBonusWatch ? (
              <>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Select
                    name="tabela_produtividade_id"
                    label="Tabela de produtividade (opcional)"
                    disabled={catalogLoading}
                    slotProps={{ inputLabel: { shrink: true } }}
                  >
                    <MenuItem value="">
                      <em>Nenhuma</em>
                    </MenuItem>
                    {(tabelasProd ?? []).map((tb) => (
                      <MenuItem key={tb.tabela_produtividade_id} value={tb.tabela_produtividade_id}>
                        {tb.nome}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text
                    name="bonus_produtividade_descricao"
                    label="Descrição / regras do bônus"
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text
                    name="bonus_produtividade_tabela_json_raw"
                    label="Tabela JSON do bônus (opcional, array JSON)"
                    multiline
                    rows={4}
                    placeholder='Ex.: [{"faixa":"A","percentual":10}]'
                  />
                </Grid>
              </>
            ) : null}
            <Grid size={{ md: 3, sm: 6 }}>
              <Field.Text
                name="percentual_gestao"
                label="% gestão operacional"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
              />
            </Grid>
            <Grid size={{ md: 3, sm: 6 }}>
              <Field.Text
                name="percentual_contrapartida"
                label="% contrapartida"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
              />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Seguro / acidentes pessoais
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, sm: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Field.Switch
                    name="possui_seguro_acidente"
                    label="Possui seguro / acidente pessoal"
                  />
                </Grid>
                {possuiSeguroWatch ? (
                  <>
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text name="tipo_cobertura_seguro" label="Tipo de cobertura" />
                    </Grid>
                    <Grid size={{ md: 12, sm: 12 }}>
                      <Field.Text
                        name="observacao_seguro"
                        label="Observação do seguro"
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          {saveFooter}
        </Box>

        <Box sx={{ display: tab === 'profissoes' ? 'block' : 'none' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Capacidade e vagas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Defina o teto de reeducandos e distribua as vagas por profissão.
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Switch name="permite_variacao_quantidade" label="Permite variar quantidade" />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1, maxWidth: 800 }}
              >
                Declaração para fins contratuais: indica se a lotação de reeducandos pode oscilar
                durante a vigência do convênio ou se deve ser tratada como quantitativo fixo. Esse
                registro orienta cláusulas e o preview do instrumento; não suspende a conferência
                das somas de vagas neste formulário em relação ao máximo informado no campo
                seguinte.
              </Typography>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="max_reeducandos"
                label="Quantidade máxima de reeducandos"
                maskPreset="positiveInt7"
                placeholder="0"
              />
            </Grid>
          </Grid>
          {isTemplateGdf ? (
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ mb: 2, width: '100%' }} />
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Quantitativo por nível (I, II, III)
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text
                    name="quantidade_nivel_i"
                    label="Nível I"
                    maskPreset="positiveInt5"
                    placeholder="0"
                  />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text
                    name="quantidade_nivel_ii"
                    label="Nível II"
                    maskPreset="positiveInt5"
                    placeholder="0"
                  />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text
                    name="quantidade_nivel_iii"
                    label="Nível III"
                    maskPreset="positiveInt5"
                    placeholder="0"
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Soma dos níveis: <strong>{somaNiveis}</strong>
                {ultrapassaNivel ? (
                  <Typography component="span" color="error.main" sx={{ ml: 1 }}>
                    Ultrapassa o máximo informado.
                  </Typography>
                ) : null}
              </Typography>
            </Box>
          ) : null}
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color={ultrapassaDistProf ? 'error.main' : 'text.primary'}
              component="div"
            >
              Soma das quantidades (linhas preenchidas): <strong>{somaDistProf}</strong>
              {!Number.isNaN(maxR) && maxR > 0 ? (
                <>
                  {' '}
                  · Máximo de reeducandos: <strong>{maxR}</strong>
                  {ultrapassaDistProf ? (
                    <>
                      {' '}
                      · Ultrapassa o máximo em <strong>{somaDistProf - maxR}</strong>
                    </>
                  ) : (
                    <>
                      {' '}
                      · Restante: <strong>{maxR - somaDistProf}</strong>
                    </>
                  )}
                </>
              ) : null}
            </Typography>
            {ultrapassaDistProf ? (
              <Alert severity="error">
                A soma das vagas por profissão não pode ultrapassar a quantidade máxima de
                reeducandos.
              </Alert>
            ) : null}
            {usaNivelWatch ? (
              <Typography variant="caption" color="text.secondary">
                Totais por nível (profissões): I = {somaDistNivel('I')} · II = {somaDistNivel('II')}{' '}
                · III = {somaDistNivel('III')}
              </Typography>
            ) : null}
          </Stack>
          <Stack spacing={2}>
            {distFields.map((field, idx) => (
              <Box
                key={field.id}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid size={{ md: 3, sm: 12 }}>
                    <ConvenioProfissaoAutocomplete
                      name={`distribuicao_profissoes.${idx}.profissao_id`}
                      label="Profissão"
                    />
                  </Grid>
                  <Grid size={{ md: 2, sm: 6 }}>
                    <Field.Text
                      name={`distribuicao_profissoes.${idx}.quantidade`}
                      label="Quantidade"
                      maskPreset="positiveInt5"
                      placeholder="0"
                    />
                  </Grid>
                  {usaNivelWatch ? (
                    <Grid size={{ md: 2, sm: 6 }}>
                      <Field.Select
                        name={`distribuicao_profissoes.${idx}.nivel`}
                        label="Nível"
                        slotProps={{ inputLabel: { shrink: true } }}
                      >
                        <MenuItem value="">
                          <em>Obrigatório</em>
                        </MenuItem>
                        <MenuItem value="I">I</MenuItem>
                        <MenuItem value="II">II</MenuItem>
                        <MenuItem value="III">III</MenuItem>
                      </Field.Select>
                    </Grid>
                  ) : null}
                  <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Text
                      name={`distribuicao_profissoes.${idx}.observacao`}
                      label="Observação"
                      multiline
                      rows={1}
                    />
                  </Grid>
                  <Grid size={{ md: 1, sm: 12 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                      type="button"
                      fullWidth
                      color="error"
                      variant="outlined"
                      size="medium"
                      onClick={() => removeDist(idx)}
                      disabled={distFields.length <= 1}
                      sx={{ height: 56, py: 0, whiteSpace: 'nowrap' }}
                    >
                      Remover
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              type="button"
              variant="outlined"
              sx={{ py: 2, minHeight: 52 }}
              onClick={() =>
                appendDist({
                  profissao_id: '',
                  quantidade: 0,
                  nivel: '',
                  observacao: '',
                })
              }
            >
              Adicionar profissão
            </Button>
          </Stack>
          {saveFooter}
        </Box>

        <Box sx={{ display: tab === 'responsaveis' ? 'block' : 'none' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Representante legal da empresa
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="responsaveis.0.nome" label="Nome" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="responsaveis.0.cargo" label="Cargo" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="responsaveis.0.documento"
                label="CPF ou CNPJ"
                maskPreset="documentoBr"
                placeholder="CPF ou CNPJ"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="responsaveis.0.email" label="E-mail" type="email" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="responsaveis.0.telefone"
                label="Telefone"
                maskPreset="phoneBrMobile"
                placeholder="(00) 00000-0000"
              />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 4, mb: 4, width: '100%' }} />
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Preposto / responsável operacional
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="responsaveis.1.nome" label="Nome" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="responsaveis.1.email" label="E-mail" type="email" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="responsaveis.1.telefone"
                label="Telefone"
                maskPreset="phoneBrMobile"
                placeholder="(00) 00000-0000"
              />
            </Grid>
          </Grid>
          {saveFooter}
        </Box>

        <Box sx={{ display: tab === 'locais' ? 'block' : 'none' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Locais de execução
          </Typography>
          <Grid container spacing={1}>
            {locaisFields.map((field, idx) => (
              <LocalExecucaoRow key={field.id} idx={idx} onRemove={() => removeLocal(idx)} />
            ))}
            <Grid size={{ md: 12, sm: 12 }} sx={{ mt: 1 }}>
              <Button
                fullWidth
                size="large"
                type="button"
                variant="outlined"
                sx={{ py: 2, minHeight: 52 }}
                onClick={() =>
                  appendLocal({
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: '',
                    cep: '',
                    referencia: '',
                  })
                }
              >
                Adicionar local de execução
              </Button>
            </Grid>
          </Grid>
          {saveFooter}
        </Box>
      </Form>
    </DashboardContent>
  );
}
