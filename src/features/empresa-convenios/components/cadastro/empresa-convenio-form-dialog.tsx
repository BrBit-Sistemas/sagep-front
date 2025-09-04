import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import MenuItem from '@mui/material/MenuItem';
import { Grid, Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { empresas as empresasMock } from 'src/features/empresas/data';

import { Form, Field } from 'src/components/hook-form';

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
  quantitativo_maximo: null,
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

  const empresaOptions = useMemo(
    () => empresasMock.map((e) => ({ label: e.razao_social, value: e.empresa_id })),
    []
  );
  const tipoOptions = useMemo(
    () => convenioTipos.map((t) => ({ label: `${t.descricao} (${t.codigo})`, value: t.codigo })),
    []
  );

  const methods = useForm({
    resolver: zodResolver(createEmpresaConvenioSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
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
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                type="number"
                name="quantitativo_maximo"
                label="Quantitativo Máximo"
                placeholder="Ex.: 30"
              />
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
