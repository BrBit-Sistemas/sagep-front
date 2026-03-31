import type { FieldErrors } from 'react-hook-form';

import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon as SearchIconify } from '@iconify/react';
import { useForm, useWatch, useFieldArray, useFormContext } from 'react-hook-form';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

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
import { empresaConvenioToFormValues } from '../helper';
import { useEmpresasOptions } from '../hooks/use-empresas-options';
import { useCreateEmpresaConvenio } from '../hooks/use-create-empresa-convenio';
import { useUpdateEmpresaConvenio } from '../hooks/use-update-empresa-convenio';
import { useEmpresaConvenioDetail } from '../hooks/use-empresa-convenio-detail';
import {
  useModelosRemuneracaoCatalog,
  usePoliticasBeneficioCatalog,
} from '../hooks/use-trabalho-penal-catalog';
import {
  createEmpresaConvenioSchema,
  type CreateEmpresaConvenioSchema,
  type CreateEmpresaConvenioFormValues,
} from '../schemas';

type TabValue = 'geral' | 'remuneracao' | 'locais';

const INITIAL_VALUES: CreateEmpresaConvenioFormValues = {
  empresa_id: '',
  modalidade_execucao: 'INTRAMUROS',
  regimes_permitidos: [],
  artigos_vedados: [],
  max_reeducandos: undefined,
  permite_variacao_quantidade: true,
  modelo_remuneracao_id: '',
  politica_beneficio_id: '',
  permite_bonus_produtividade: false,
  percentual_gestao: undefined,
  percentual_contrapartida: undefined,
  locais_execucao: [],
  data_inicio: formatDateToYYYYMMDD(new Date()),
  data_fim: null,
  observacoes: '',
};

const TAB_GERAL_FIELDS: (keyof CreateEmpresaConvenioFormValues)[] = [
  'empresa_id',
  'modalidade_execucao',
  'regimes_permitidos',
  'artigos_vedados',
  'max_reeducandos',
  'permite_variacao_quantidade',
  'data_inicio',
  'data_fim',
  'observacoes',
];

const TAB_REMUNERACAO_FIELDS: (keyof CreateEmpresaConvenioFormValues)[] = [
  'modelo_remuneracao_id',
  'politica_beneficio_id',
  'permite_bonus_produtividade',
  'percentual_gestao',
  'percentual_contrapartida',
];

const LocalExecucaoRow = ({ idx, onRemove }: { idx: number; onRemove: () => void }) => {
  const { setValue, control } = useFormContext();
  const [loadingCep, setLoadingCep] = useState(false);
  const [errorCep, setErrorCep] = useState<string | null>(null);
  const [openBusca, setOpenBusca] = useState(false);

  const cep: string = useWatch({ control, name: `locais_execucao.${idx}.cep` as const }) as string;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    if (value.length < 8) {
      setValue(`locais_execucao.${idx}.logradouro`, '');
      setValue(`locais_execucao.${idx}.numero`, '');
      setValue(`locais_execucao.${idx}.complemento`, '');
      setValue(`locais_execucao.${idx}.bairro`, '');
      setValue(`locais_execucao.${idx}.cidade`, '');
      setValue(`locais_execucao.${idx}.estado`, '');
    }
    setValue(`locais_execucao.${idx}.cep`, value);
  };

  useEffect(() => {
    const onlyDigits = (cep || '').replace(/\D/g, '');
    if (onlyDigits.length === 8 && cep && !cep.includes('-')) {
      const formatted = `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5)}`;
      setValue(`locais_execucao.${idx}.cep`, formatted, { shouldValidate: false });
    }
  }, [cep, idx, setValue]);

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
    setValue(`locais_execucao.${idx}.cep`, cepSel);
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
            onChange={handleCepChange}
            inputProps={{ maxLength: 9 }}
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
            inputProps={{ maxLength: 2 }}
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
  { value: 'locais' as const, label: 'Locais de execução', icon: <Iconify icon="solar:flag-bold" /> },
];

function selectTabForErrors(errors: FieldErrors<CreateEmpresaConvenioFormValues>): TabValue {
  if (TAB_GERAL_FIELDS.some((k) => errors[k] != null)) return 'geral';
  if (TAB_REMUNERACAO_FIELDS.some((k) => errors[k] != null)) return 'remuneracao';
  if (errors.locais_execucao != null) return 'locais';
  return 'geral';
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
  const { data: modelos, isLoading: loadingModelos } = useModelosRemuneracaoCatalog();
  const { data: politicas, isLoading: loadingPoliticas } = usePoliticasBeneficioCatalog();
  const [tab, setTab] = useState<TabValue>('geral');

  const isSaving = isEditing ? isUpdating : isCreating;
  const { options: empresaOptions, indexMap: empresasIndex } = useEmpresasOptions('');

  const methods = useForm<CreateEmpresaConvenioFormValues, unknown, CreateEmpresaConvenioSchema>({
    resolver: zodResolver(createEmpresaConvenioSchema),
    defaultValues: INITIAL_VALUES,
    shouldUnregister: false,
  });

  const empresaIdWatch = useWatch({ control: methods.control, name: 'empresa_id' });
  const empresaNome = empresaIdWatch ? empresasIndex.get(empresaIdWatch) : undefined;

  const {
    fields: locaisFields,
    append: appendLocal,
    remove: removeLocal,
  } = useFieldArray({
    name: 'locais_execucao',
    control: methods.control,
  });

  const catalogPrefilledRef = useRef(false);

  useEffect(() => {
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
    const m0 = modelos?.[0]?.modelo_remuneracao_id;
    const p0 = politicas?.[0]?.politica_beneficio_id;
    if (m0) methods.setValue('modelo_remuneracao_id', m0);
    if (p0) methods.setValue('politica_beneficio_id', p0);
    if (m0 && p0) catalogPrefilledRef.current = true;
  }, [isEditing, modelos, politicas, methods]);

  const catalogLoading = loadingModelos || loadingPoliticas;
  const catalogEmpty = !catalogLoading && (!modelos?.length || !politicas?.length);

  const onSubmit = async (data: CreateEmpresaConvenioSchema) => {
    if (isEditing && convenioId) {
      await updateItem({ convenioId, ...data });
    } else {
      await createItem(data);
    }
    navigate(paths.empresaConvenios.root);
  };

  const onInvalid = (errors: FieldErrors<CreateEmpresaConvenioFormValues>) => {
    setTab(selectTabForErrors(errors));
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
            <Tabs value={tab} onChange={handleTabChange} variant="scrollable" allowScrollButtonsMobile>
              {tabNav.map((item) => (
                <Tab key={item.value} value={item.value} label={item.label} icon={item.icon} />
              ))}
            </Tabs>
          </Box>
        </Card>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          * Campos obrigatórios · Salvar envia todas as abas
        </Typography>

        {catalogEmpty && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cadastre ao menos um modelo de remuneração e uma política de benefício na API (seed ou
            etapa 2) para habilitar este formulário.
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
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select required name="modalidade_execucao" label="Modalidade de execução">
                <MenuItem value="INTRAMUROS">Intramuros</MenuItem>
                <MenuItem value="EXTRAMUROS">Extramuros</MenuItem>
              </Field.Select>
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
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="max_reeducandos"
                label="Quantidade máxima de reeducandos"
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Field.Switch name="permite_variacao_quantidade" label="Permite variar quantidade" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_inicio" label="Data início" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_fim" label="Data fim" />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text name="observacoes" label="Observações" multiline rows={3} />
            </Grid>
          </Grid>
          {saveFooter}
        </Box>

        <Box sx={{ display: tab === 'remuneracao' ? 'block' : 'none' }}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="modelo_remuneracao_id"
                label="Modelo de remuneração"
                required
                disabled={catalogLoading || catalogEmpty}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {(modelos ?? []).map((m) => (
                  <MenuItem key={m.modelo_remuneracao_id} value={m.modelo_remuneracao_id}>
                    {`${m.nome} (${m.tipo_calculo}${m.usa_nivel ? ', por nível' : ''})`}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="politica_beneficio_id"
                label="Política de benefício"
                required
                disabled={catalogLoading || catalogEmpty}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {(politicas ?? []).map((p) => (
                  <MenuItem key={p.politica_beneficio_id} value={p.politica_beneficio_id}>
                    Transporte: {p.tipo_transporte} · Alimentação: {p.tipo_alimentacao}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Field.Switch
                name="permite_bonus_produtividade"
                label="Permite bônus por produtividade"
              />
            </Grid>
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
                type="button"
                variant="outlined"
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
