import {
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useSecretariaCadastroStore } from '../stores';
import { useDeleteSecretaria } from '../hooks/use-delete-secretaria';

export const SecretariaDeleteDialog = () => {
  const { isDeleteDialogOpen, selectedSecretaria, closeDeleteDialog } =
    useSecretariaCadastroStore();
  const { mutateAsync: deleteSecretaria, isPending } = useDeleteSecretaria();

  const handleDelete = async () => {
    if (selectedSecretaria) {
      await deleteSecretaria(selectedSecretaria.id);
      closeDeleteDialog();
    }
  };

  if (!selectedSecretaria) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir &ldquo;{selectedSecretaria.nome}&rdquo;? Esta ação não pode
          ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" loading={isPending}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
