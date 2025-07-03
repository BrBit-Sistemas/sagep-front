import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { useCreateProfissao } from '../../hooks/use-create-profissao';
import { useUpdateProfissao } from '../../hooks/use-update-profissao';
import { createProfissaoSchema, type CreateProfissaoSchema } from '../../schemas';

type ProfissaoFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateProfissaoSchema;
  profissaoId?: string;
};

const INITIAL_VALUES: CreateProfissaoSchema = {
  nome: '',
};

export const ProfissaoFormDialog = ({
  defaultValues,
  profissaoId,
  onSuccess,
  onClose,
  open,
}: ProfissaoFormDialogProps) => {
  const isEditing = !!profissaoId;
  const { mutateAsync: createProfissao, isPending: isCreating } = useCreateProfissao();
  const { mutateAsync: updateProfissao, isPending: isUpdating } = useUpdateProfissao();

  const isLoading = isEditing ? isUpdating : isCreating;

  const methods = useForm({
    resolver: zodResolver(createProfissaoSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateProfissao({ profissaoId, ...data });
    } else {
      await createProfissao(data);
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
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Profissão</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha o campo abaixo para {isEditing ? 'editar' : 'adicionar'} a profissão.
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text name="nome" label="Nome da Profissão" />
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
