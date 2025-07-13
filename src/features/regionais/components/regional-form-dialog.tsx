import type { CreateRegionalSchema } from '../schemas';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useListSecretarias } from 'src/features/secretarias/hooks/use-list-secretaria';

import { Form, Field } from 'src/components/hook-form';

import { createRegionalSchema } from '../schemas';
import { useUpdateRegional } from '../hooks/use-update-regional';
import { useCreateRegional } from '../hooks/use-create-regional';

type RegionalFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateRegionalSchema;
  regionalId?: string;
};

const INITIAL_VALUES: CreateRegionalSchema = {
  secretariaId: '',
  nome: '',
};

export const RegionalFormDialog = ({
  defaultValues,
  regionalId,
  onSuccess,
  onClose,
  open,
}: RegionalFormDialogProps) => {
  const isEditing = !!regionalId;
  const { mutateAsync: createRegional, isPending: isCreating } = useCreateRegional();
  const { mutateAsync: updateRegional, isPending: isUpdating } = useUpdateRegional();

  const { data: { items: secretarias } = { items: [] } } = useListSecretarias({
    page: 0,
    limit: 1000,
  });

  const isLoading = isEditing ? isUpdating : isCreating;

  const methods = useForm({
    resolver: zodResolver(createRegionalSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateRegional({ id: regionalId, ...data });
    } else {
      await createRegional(data);
    }
    methods.reset(INITIAL_VALUES);
    onSuccess();
  });

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Regional</DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="nome"
                label="Nome da Regional"
                placeholder="Digite o nome da regional"
              />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="secretariaId"
                label="Secretaria"
                placeholder="Selecione a secretaria"
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={isLoading || !secretarias?.length}
              >
                {secretarias?.map((secretaria) => (
                  <MenuItem key={secretaria.id} value={secretaria.id}>
                    {secretaria.nome}
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
