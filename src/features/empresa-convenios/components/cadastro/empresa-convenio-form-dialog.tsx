import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import {
  Grid,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
} from '@mui/material';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { Form, Field } from 'src/components/hook-form';

import { useEmpresasOptions } from '../../hooks/use-empresas-options';
import { useProfissoesOptions } from '../../hooks/use-profissoes-options';
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
  const { ids: profissaoIds, labelMap: profissaoLabels } = useProfissoesOptions('');
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
        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }} sx={{ mt: 1 }}>
              <Field.Select
                name="empresa_id"
                label="Empresa"
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
              <Field.Select name="modalidade_execucao" label="Modalidade de Execução">
                <MenuItem value="INTRAMUROS">Intramuros</MenuItem>
                <MenuItem value="EXTRAMUROS">Extramuros</MenuItem>
              </Field.Select>
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.MultiSelect
                name="regimes_permitidos"
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
                groupBy={(option) => artigosCodigoIndex[typeof option === 'number' ? option : Number(option)] || 'CP'}
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
                  <Grid key={field.id} container spacing={1} alignItems="center">
                    <Grid size={{ md: 6, sm: 12 }}>
                      <Field.Autocomplete
                        name={`quantitativos_profissoes.${idx}.profissao_id`}
                        label="Profissão"
                        options={profissaoIds}
                        getOptionLabel={(id: unknown) =>
                          profissaoLabels.get(String(id)) || String(id)
                        }
                        isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
                      />
                    </Grid>
                    <Grid size={{ md: 4, sm: 8 }}>
                      <Field.Text
                        type="number"
                        name={`quantitativos_profissoes.${idx}.quantidade`}
                        label="Qtd. Máxima"
                        placeholder="Ex.: 10"
                      />
                    </Grid>
                    <Grid size={{ md: 2, sm: 4 }}>
                      <Button color="error" variant="outlined" onClick={() => remove(idx)}>
                        Remover
                      </Button>
                    </Grid>
                  </Grid>
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
                      <Field.Text
                        name={`locais_execucao.${idx}.bairro`}
                        label="Bairro"
                      />
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
                    <Grid size={{ md: 2, sm: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => removeLocal(idx)}
                      >
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
