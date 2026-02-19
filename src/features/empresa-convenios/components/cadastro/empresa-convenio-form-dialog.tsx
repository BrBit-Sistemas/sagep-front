import { zodResolver } from '@hookform/resolvers/zod';
import { Icon as SearchIconify } from '@iconify/react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useForm, useWatch, useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Grid,
  Alert,
  Button,
  Dialog,
  Divider,
  Tooltip,
  MenuItem,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { getProfissoes } from 'src/api/profissoes/profissoes';
import { enderecoApiService } from 'src/services/endereco-api.service';
import { ArticlesSelector } from 'src/features/artigos-penais/components/articles-selector';

import { Form, Field } from 'src/components/hook-form';
import { EnderecoSearchDialog } from 'src/components/forms/endereco-search-dialog';

import { convenioTipos, regimesOptions } from '../../data';
import { useEmpresasOptions } from '../../hooks/use-empresas-options';
import { useProfissoesAutocomplete } from '../../hooks/use-profissoes-options';
import { useCreateEmpresaConvenio } from '../../hooks/use-create-empresa-convenio';
import { useUpdateEmpresaConvenio } from '../../hooks/use-update-empresa-convenio';
import { createEmpresaConvenioSchema, type CreateEmpresaConvenioSchema } from '../../schemas';

type Props = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateEmpresaConvenioSchema;
  convenioId?: string;
};

const INITIAL_VALUES: CreateEmpresaConvenioSchema = {
  empresa_id: '',
  tipo_codigo: '',
  modalidade_execucao: 'INTRAMUROS',
  regimes_permitidos: [],
  artigos_vedados: [],
  quantitativos_profissoes: [],
  locais_execucao: [],
  data_inicio: formatDateToYYYYMMDD(new Date()),
  data_fim: null,
  status: 'RASCUNHO',
  observacoes: '',
};

// Componente interno para cada linha de profissão com estado independente
type ProfissaoFieldRowProps = {
  index: number;
  onRemove: () => void;
};

const ProfissaoFieldRow = ({ index, onRemove }: ProfissaoFieldRowProps) => {
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
  const currentProfissaoId = watch(`quantitativos_profissoes.${index}.profissao_id`);

  // Carregar profissões iniciais quando o componente é montado (para modo de edição)
  useEffect(() => {
    if (currentProfissaoId && !labelCache.current.has(String(currentProfissaoId))) {
      const api = getProfissoes();
      // Primeiro, tentar buscar diretamente pelo ID para garantir o label correto
      api
        .findOne(String(currentProfissaoId))
        .then((prof) => {
          if (prof?.id && prof?.nome) {
            labelCache.current.set(String(prof.id), prof.nome);
            setInitialProfissoes((prev) => {
              const exists = prev.some((p: any) => String(p.id) === String(prof.id));
              return exists ? prev : [...prev, prof];
            });
          }
        })
        .catch(() => {
          // Como fallback, carregar um lote inicial
          api
            .findAll({ page: 0, limit: 100 })
            .then((response) => {
              if (response.items) {
                setInitialProfissoes(response.items);
                response.items.forEach((p: any) => {
                  labelCache.current.set(String(p.id), p.nome);
                });
              }
            })
            .catch(() => void 0);
        });
    }
  }, [currentProfissaoId]);

  // Atualizar cache com novas opções da busca
  useEffect(() => {
    profissoes.forEach((p: any) => {
      labelCache.current.set(String(p.id), p.nome);
    });
  }, [profissoes]);

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
    <Grid container spacing={1} alignItems="center">
      <Grid size={{ md: 5, sm: 12 }}>
        <Field.Autocomplete
          name={`quantitativos_profissoes.${index}.profissao_id`}
          label="Profissão"
          nullToEmptyString
          options={allOptions}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
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
      </Grid>
      <Grid size={{ md: 2, sm: 4 }}>
        <Field.Text
          type="number"
          name={`quantitativos_profissoes.${index}.quantidade`}
          label="Qtd. Máxima"
          placeholder="Ex.: 10"
        />
      </Grid>
      <Grid size={{ md: 5, sm: 12 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid size={{ md: 9, sm: 8 }}>
            <Field.Autocomplete
              sx={{ height: 56, width: 270 }}
              name={`quantitativos_profissoes.${index}.escolaridade_minima`}
              label="Escolaridade mínima"
              options={[
                'NÃO ALFABETIZADO',
                'FUNDAMENTAL I INCOMPLETO',
                'FUNDAMENTAL I COMPLETO',
                'FUNDAMENTAL II INCOMPLETO',
                'FUNDAMENTAL II COMPLETO',
                'ENSINO MÉDIO INCOMPLETO',
                'ENSINO MÉDIO COMPLETO',
                'SUPERIOR INCOMPLETO',
                'SUPERIOR COMPLETO',
                'PÓS-GRADUAÇÃO',
                'MESTRADO',
                'DOUTORADO',
                'PÓS-DOUTORADO',
              ]}
              getOptionLabel={(v) => String(v)}
              isOptionEqualToValue={(a, b) => String(a) === String(b)}
              placeholder="Selecione..."
            />
          </Grid>
          <Grid size={{ md: 3, sm: 4 }}>
            <Button
              color="error"
              variant="outlined"
              onClick={onRemove}
              fullWidth
              sx={{ height: 56, width: 115, ml: 5 }}
            >
              Remover
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

// Campos do local de execução com busca de CEP (direta e reversa)
const LocalExecucaoRow = ({ idx, onRemove }: { idx: number; onRemove: () => void }) => {
  const { setValue, control } = useFormContext();
  const [loadingCep, setLoadingCep] = useState(false);
  const [errorCep, setErrorCep] = useState<string | null>(null);
  const [openBusca, setOpenBusca] = useState(false);

  const cep: string = useWatch({ control, name: `locais_execucao.${idx}.cep` as const }) as any;

  // Formatar CEP automaticamente ao digitar
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`; // Adiciona o traço
    }

    // Limpa os campos de endereço quando o CEP é alterado
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

  // Formatar CEP ao carregar (para edição)
  useEffect(() => {
    const onlyDigits = (cep || '').replace(/\D/g, '');
    if (onlyDigits.length === 8 && cep && !cep.includes('-')) {
      // Se o CEP tem 8 dígitos mas não tem traço, formata
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
        {/* CEP primeiro com busca reversa */}
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

      {/* Mensagem de erro do CEP */}
      {errorCep && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          {errorCep}
        </Alert>
      )}

      {/* Dialog de busca reversa */}
      <EnderecoSearchDialog
        open={openBusca}
        onClose={() => setOpenBusca(false)}
        onSelectCep={handleSelecionarCep}
      />
    </Box>
  );
};

export const EmpresaConvenioFormDialog = ({
  defaultValues,
  convenioId,
  onSuccess,
  onClose,
  open,
}: Props) => {
  const isEditing = !!convenioId;
  const { mutateAsync: createItem, isPending: isCreating } = useCreateEmpresaConvenio();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateEmpresaConvenio();

  const isLoading = isEditing ? isUpdating : isCreating;

  const { options: empresaOptions } = useEmpresasOptions('');
  const tipoOptions = useMemo(
    () => convenioTipos.map((t) => ({ label: `${t.descricao} (${t.codigo})`, value: t.codigo })),
    []
  );

  const methods = useForm({
    resolver: zodResolver(createEmpresaConvenioSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    name: 'quantitativos_profissoes',
    control: methods.control,
  });

  const {
    fields: locaisFields,
    append: appendLocal,
    remove: removeLocal,
  } = useFieldArray({
    name: 'locais_execucao',
    control: methods.control,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateItem({ convenioId, ...data });
    } else {
      await createItem(data);
    }
    methods.reset(INITIAL_VALUES);
    onSuccess();
  });

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Convênio</DialogTitle>
      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
            * Campos obrigatórios
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }} sx={{ mt: 1 }}>
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
            <Grid size={{ md: 6, sm: 12 }} sx={{ mt: 1 }}>
              <Field.Select
                name="tipo_codigo"
                label="Tipo"
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: { transform: 'translate(14px, -6px) scale(0.75)' },
                  },
                  select: { displayEmpty: true },
                }}
              >
                {tipoOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select required name="modalidade_execucao" label="Modalidade de Execução">
                <MenuItem value="INTRAMUROS">Intramuros</MenuItem>
                <MenuItem value="EXTRAMUROS">Extramuros</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.MultiSelect
                name="regimes_permitidos"
                required
                label="Regimes Permitidos"
                options={regimesOptions}
                fullWidth
                checkbox
                chip
                placeholder="Selecione..."
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <ArticlesSelector name="artigos_vedados" label="Artigos Vedados" />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Divider sx={{ mt: 2, mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Quantitativo de vagas por profissão
              </Typography>
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Grid container spacing={1}>
                {fields.map((field, idx) => (
                  <ProfissaoFieldRow key={field.id} index={idx} onRemove={() => remove(idx)} />
                ))}
                <Grid size={{ md: 12, sm: 12 }} sx={{ mt: 3, mb: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => append({ profissao_id: '', quantidade: 1 })}
                  >
                    Adicionar quantitativo de vagas disponibilizadas
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Divider sx={{ mt: 2, mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Locais de execução
              </Typography>
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Grid container spacing={1}>
                {locaisFields.map((field, idx) => (
                  <LocalExecucaoRow key={field.id} idx={idx} onRemove={() => removeLocal(idx)} />
                ))}
                <Grid size={{ md: 12, sm: 12 }} sx={{ mt: 2 }}>
                  <Button
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
                  <Divider sx={{ mt: 3, mb: 4 }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_inicio" label="Data Início" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_fim" label="Data Fim" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select name="status" label="Status">
                <MenuItem value="RASCUNHO">Rascunho</MenuItem>
                <MenuItem value="ATIVO">Ativo</MenuItem>
                <MenuItem value="SUSPENSO">Suspenso</MenuItem>
                <MenuItem value="ENCERRADO">Encerrado</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text name="observacoes" label="Observações" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isEditing ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
