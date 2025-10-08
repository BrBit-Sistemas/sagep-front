import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import {
  Grid,
  Dialog,
  Button,
  Divider,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { getProfissoes } from 'src/api/profissoes/profissoes';

import { Form, Field } from 'src/components/hook-form';

import { useEmpresasOptions } from '../../hooks/use-empresas-options';
import { useProfissoesAutocomplete } from '../../hooks/use-profissoes-options';
import { useCreateEmpresaConvenio } from '../../hooks/use-create-empresa-convenio';
import { useUpdateEmpresaConvenio } from '../../hooks/use-update-empresa-convenio';
import { createEmpresaConvenioSchema, type CreateEmpresaConvenioSchema } from '../../schemas';
import { convenioTipos, regimesOptions, artigosOptions, artigosCodigoIndex } from '../../data';

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
      // Buscar todas as profissões para encontrar a atual
      api
        .findAll({ page: 0, limit: 100 })
        .then((response) => {
          if (response.items) {
            setInitialProfissoes(response.items);
            // Adicionar todas as profissões ao cache
            response.items.forEach((p: any) => {
              labelCache.current.set(String(p.id), p.nome);
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
      <Grid size={{ md: 6, sm: 12 }}>
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
      <Grid size={{ md: 4, sm: 8 }}>
        <Field.Text
          type="number"
          name={`quantitativos_profissoes.${index}.quantidade`}
          label="Qtd. Máxima"
          placeholder="Ex.: 10"
        />
      </Grid>
      <Grid size={{ md: 2, sm: 4 }}>
        <Button color="error" variant="outlined" onClick={onRemove}>
          Remover
        </Button>
      </Grid>
    </Grid>
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
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          * Campos obrigatórios
        </Typography>
        <Form methods={methods} onSubmit={handleSubmit}>
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
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Autocomplete
                multiple
                name="artigos_vedados"
                label="Artigos Vedados"
                placeholder="Digite para buscar..."
                options={artigosOptions.map((a) => Number(a.value))}
                groupBy={(option) =>
                  artigosCodigoIndex[typeof option === 'number' ? option : Number(option)] || 'CP'
                }
                getOptionLabel={(option) => {
                  const num = typeof option === 'number' ? option : Number(option);
                  const found = artigosOptions.find((a) => Number(a.value) === num);
                  return found?.label ?? String(option);
                }}
                isOptionEqualToValue={(option, value) => Number(option) === Number(value)}
                filterSelectedOptions
                slotProps={{
                  textField: {
                    size: 'medium',
                    slotProps: { inputLabel: { shrink: true } },
                  },
                }}
              />
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
                  <Grid
                    key={field.id}
                    container
                    spacing={1}
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Text
                        name={`locais_execucao.${idx}.logradouro`}
                        label="Logradouro"
                        placeholder="Av. Brasil"
                      />
                    </Grid>
                    <Grid size={{ md: 2, sm: 6 }}>
                      <Field.Text
                        name={`locais_execucao.${idx}.numero`}
                        label="Número"
                        placeholder="123"
                      />
                    </Grid>
                    <Grid size={{ md: 4, sm: 6 }}>
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
                    <Grid size={{ md: 2, sm: 6 }}>
                      <Field.Text
                        name={`locais_execucao.${idx}.cep`}
                        label="CEP"
                        placeholder="69300000"
                        inputProps={{ maxLength: 8 }}
                      />
                    </Grid>
                    <Grid size={{ md: 10, sm: 12 }}>
                      <Field.Text
                        name={`locais_execucao.${idx}.referencia`}
                        label="Referência"
                        placeholder="Ponto de referência"
                      />
                    </Grid>
                    <Grid
                      size={{ md: 2, sm: 12 }}
                      sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button color="error" variant="outlined" onClick={() => removeLocal(idx)}>
                        Remover local
                      </Button>
                    </Grid>
                  </Grid>
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
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
