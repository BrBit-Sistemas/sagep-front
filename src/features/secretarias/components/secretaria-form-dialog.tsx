import type { CreateSecretariaSchema } from '../schemas';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { createSecretariaSchema } from '../schemas';
import { useUpdateSecretaria } from '../hooks/use-update-secretaria';
import { useCreateSecretaria } from '../hooks/use-create-secretaria';

type SecretariaFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateSecretariaSchema;
  secretariaId?: string;
};

const INITIAL_VALUES: CreateSecretariaSchema = {
  nome: '',
};

export const SecretariaFormDialog = ({
  defaultValues,
  secretariaId,
  onSuccess,
  onClose,
  open,
}: SecretariaFormDialogProps) => {
  const isEditing = !!secretariaId;
  const { mutateAsync: createSecretaria, isPending: isCreating } = useCreateSecretaria();
  const { mutateAsync: updateSecretaria, isPending: isUpdating } = useUpdateSecretaria();

  const isLoading = isEditing ? isUpdating : isCreating;

  const methods = useForm({
    resolver: zodResolver(createSecretariaSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateSecretaria({ ...data, secretariaId });
    } else {
      await createSecretaria(data);
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
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Secretaria</DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text
                name="nome"
                label="Nome da Secretaria"
                placeholder="Digite o nome da secretaria"
              />
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
