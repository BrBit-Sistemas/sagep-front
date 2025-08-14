import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  Switch,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { type FieldError } from 'src/utils/handle-error';
import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Form, Field } from 'src/components/hook-form';

import { Regime, Escolaridade } from '../../types';
import { useCreateDetento } from '../../hooks/use-create-detento';
import { useUpdateDetento } from '../../hooks/use-update-detento';
import { createDetentoSchema, type CreateDetentoSchema } from '../../schemas';
import { useDetentoDetalhesStore } from '../../stores/detento-detalhes-store';
import { detentoDetalhesSearchQuerySerializer } from '../../hooks/use-dentento-detalhes-search-params';

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

  const [fillFichaCadastral, setFillFichaCadastral] = useState(false);

  const { mutateAsync: createDetento, isPending: isCreating } = useCreateDetento();
  const { mutateAsync: updateDetento, isPending: isUpdating } = useUpdateDetento();
  const { openFichaCadastralCreateDialog } = useDetentoDetalhesStore();

  const router = useRouter();

  const isLoading = isEditing ? isUpdating : isCreating;

  // Function to set field errors in the form
  const setFieldErrors = (fieldErrors: FieldError[]) => {
    fieldErrors.forEach(({ field, message }) => {
      methods.setError(field as any, {
        type: 'server',
        message,
      });
    });
  };

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 0,
    limit: 1000,
  });

  // Format default values for display
  const formattedDefaultValues = defaultValues ? {
    ...defaultValues,
    data_nascimento: defaultValues.data_nascimento ? formatDateToDDMMYYYY(defaultValues.data_nascimento) : '',
  } : undefined;

  const methods = useForm({
    resolver: zodResolver(createDetentoSchema),
    defaultValues: isEditing ? formattedDefaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      let _detentoId: string;

      if (isEditing) {
        await updateDetento({ detentoId, ...data });
        _detentoId = detentoId;
      } else {
        const newDetento = await createDetento(data);
        _detentoId = newDetento.id;
      }

      if (fillFichaCadastral) {
        const path = paths.detentos.detalhes(_detentoId);
        const url = detentoDetalhesSearchQuerySerializer(path, { tab: 'ficha_cadastral' });
        router.push(url);
        setTimeout(() => openFichaCadastralCreateDialog(), 0);
      } else {
        const path = paths.detentos.detalhes(_detentoId);
        router.push(path);
      }

      methods.reset(INITIAL_VALUES);
      onSuccess();
    } catch (error: any) {
      // Handle field-specific errors
      if (error.fieldErrors && Array.isArray(error.fieldErrors)) {
        setFieldErrors(error.fieldErrors);
        return;
      }

      // Re-throw other errors to be handled by the mutation
      throw error;
    }
  });

  useEffect(() => {
    if (isEditing) methods.reset(formattedDefaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, formattedDefaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar detento</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha os campos abaixo para adicionar um novo detento.
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
              <Field.Select
                name="unidade_id"
                label="Unidade Prisional"
                disabled={!!defaultValues?.unidade_id}
              >
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
        <FormControlLabel
          control={
            <Switch
              checked={fillFichaCadastral}
              onChange={(_, checked) => setFillFichaCadastral(checked)}
            />
          }
          label="Preencher ficha cadastral?"
          sx={{ mr: 'auto' }}
        />
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          loading={isLoading}
          disabled={isLoading}
        >
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
