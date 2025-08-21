import type { CreateProfissaoSchema } from '../../schemas';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Dialog,
  Button,
  Switch,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { createProfissaoSchema } from '../../schemas';
import { useCreateProfissao } from '../../hooks/use-create-profissao';
import { useUpdateProfissao } from '../../hooks/use-update-profissao';

const INITIAL_VALUES: CreateProfissaoSchema = {
  nome: '',
  descricao: '',
  ativo: true,
};
interface ProfissaoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValues?: CreateProfissaoSchema;
  profissaoId?: string;
}

export function ProfissaoFormDialog({
  open,
  onClose,
  onSuccess,
  defaultValues,
  profissaoId,
}: ProfissaoFormDialogProps) {
  const isEditing = !!profissaoId;

  const methods = useForm({
    resolver: zodResolver(createProfissaoSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const { mutateAsync: createProfissao, isPending: isCreating } = useCreateProfissao();
  const { mutateAsync: updateProfissao, isPending: isUpdating } = useUpdateProfissao();

  const isLoading = isEditing ? isUpdating : isCreating;

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateProfissao({ id: profissaoId, ...data });
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Profissão' : 'Nova Profissão'}</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="nome" label="Nome" placeholder="Digite o nome da profissão" />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="descricao" label="Descrição" fullWidth multiline rows={3} />
            </Grid>

            <FormControlLabel
              control={<Switch {...methods.register('ativo')} checked={methods.watch('ativo')} />}
              label="Ativo"
            />
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
}
