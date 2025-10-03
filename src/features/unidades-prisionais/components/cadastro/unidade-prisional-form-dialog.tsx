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

import { useListRegionais } from 'src/features/regionais/hooks/use-list-regionais';

import { Form, Field } from 'src/components/hook-form';

import { useCreateUnidadePrisional } from '../../hooks/use-create-unidade-prisional';
import { useUpdateUnidadePrisional } from '../../hooks/use-update-unidade-prisional';
import { createUnidadePrisionalSchema, type CreateUnidadePrisionalSchema } from '../../schemas';

type UnidadePrisionalFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateUnidadePrisionalSchema;
  unidadeId?: string;
};

const INITIAL_VALUES: CreateUnidadePrisionalSchema = {
  nome: '',
  regionalId: '',
};

export const UnidadePrisionalFormDialog = ({
  defaultValues,
  unidadeId,
  onSuccess,
  onClose,
  open,
}: UnidadePrisionalFormDialogProps) => {
  const isEditing = !!unidadeId;
  const { mutateAsync: createUnidadePrisional, isPending: isCreating } =
    useCreateUnidadePrisional();
  const { mutateAsync: updateUnidadePrisional, isPending: isUpdating } =
    useUpdateUnidadePrisional();

  const { data: { items: regionais } = { items: [] } } = useListRegionais({
    page: 0,
    limit: 1000,
  });

  const isLoading = isEditing ? isUpdating : isCreating;

  const methods = useForm({
    resolver: zodResolver(createUnidadePrisionalSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateUnidadePrisional({ id: unidadeId, ...data });
    } else {
      await createUnidadePrisional(data);
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
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Unidade Prisional</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha os campos abaixo para {isEditing ? 'editar' : 'adicionar'} a unidade prisional.
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          * Campos obrigatórios
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text required name="nome" label="Nome da Unidade" />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="regionalId"
                required
                label="Regional"
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={isLoading || !regionais?.length}
              >
                {regionais?.map((regional) => (
                  <MenuItem key={regional.id} value={regional.id}>
                    {regional.nome}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
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
