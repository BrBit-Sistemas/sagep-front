import type { CreateProfissaoSchema } from '../../schemas';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material';

import { createProfissaoSchema } from '../../schemas';
import { useCreateProfissao } from '../../hooks/use-create-profissao';
import { useUpdateProfissao } from '../../hooks/use-update-profissao';

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

  const form = useForm<CreateProfissaoSchema>({
    resolver: zodResolver(createProfissaoSchema),
    defaultValues: defaultValues || {
      nome: '',
      descricao: '',
      ativo: true,
    },
  });

  const createMutation = useCreateProfissao();
  const updateMutation = useUpdateProfissao();

  const onSubmit = async (data: CreateProfissaoSchema) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: profissaoId!, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Profissão' : 'Nova Profissão'}</DialogTitle>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              {...form.register('nome')}
              label="Nome"
              fullWidth
              error={!!form.formState.errors.nome}
              helperText={form.formState.errors.nome?.message}
            />

            <TextField
              {...form.register('descricao')}
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              error={!!form.formState.errors.descricao}
              helperText={form.formState.errors.descricao?.message}
            />

            <FormControlLabel
              control={<Switch {...form.register('ativo')} checked={form.watch('ativo')} />}
              label="Ativo"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
