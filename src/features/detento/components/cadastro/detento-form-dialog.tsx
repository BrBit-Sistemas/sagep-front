import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Form, Field } from 'src/components/hook-form';

import { Regime, Escolaridade } from '../../types';
import { useCreateDetento } from '../../hooks/use-create-detento';
import { useUpdateDetento } from '../../hooks/use-update-detento';
import { createDetentoSchema, type CreateDetentoSchema } from '../../schemas';

type DetentoFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateDetentoSchema;
  detentoId?: string;
};

const INITIAL_VALUES: CreateDetentoSchema = {
  nome: '',
  prontuario: '',
  cpf: '',
  data_nascimento: '',
  regime: Regime.FECHADO,
  escolaridade: Escolaridade.FUNDAMENTAL,
  unidade_id: '',
};

export const DetentoFormDialog = ({
  defaultValues,
  detentoId,
  onSuccess,
  onClose,
  open,
}: DetentoFormDialogProps) => {
  const isEditing = !!detentoId;

  const { mutateAsync: createDetento, isPending: isCreating } = useCreateDetento();
  const { mutateAsync: updateDetento, isPending: isUpdating } = useUpdateDetento();
  // const { openFichaCadastralCreateDialog } = useDetentoDetalhesStore();

  const isLoading = isEditing ? isUpdating : isCreating;

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 0,
    limit: 1000,
  });

  // Format default values for display - keep date in YYYY-MM-DD format for DatePicker
  const formattedDefaultValues = defaultValues
    ? {
        ...defaultValues,
        // Keep the date in YYYY-MM-DD format for the DatePicker component
        data_nascimento: formatDateToYYYYMMDD(defaultValues.data_nascimento) || '',
      }
    : undefined;

  console.log(formattedDefaultValues);

  const methods = useForm({
    resolver: zodResolver(createDetentoSchema),
    defaultValues: isEditing ? formattedDefaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    const payload = {
      ...data,
      data_nascimento: formatDateToYYYYMMDD(data.data_nascimento) || '',
    };

    if (isEditing) {
      await updateDetento({ detentoId, ...payload });
    } else {
      await createDetento(payload);
    }
    methods.reset(INITIAL_VALUES);
    onSuccess();
  });

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Editar detento' : 'Adicionar detento'}</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          {isEditing
            ? 'Edite os campos abaixo para atualizar o detento.'
            : 'Preencha os campos abaixo para adicionar um novo detento.'}
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="nome" label="Nome" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="prontuario" label="Prontuário" />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Cpf name="cpf" label="CPF" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_nascimento" label="Data de nascimento" disableFuture />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                name="regime"
                label="Regime"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {Object.values(Regime).map((option) => (
                  <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                name="escolaridade"
                label="Escolaridade"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {Object.values(Escolaridade).map((option) => (
                  <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="unidade_id" label="Unidade Prisional">
                {unidades.map((unidade) => (
                  <MenuItem key={unidade.id} value={unidade.id}>
                    {unidade.nome}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" loading={isLoading}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
