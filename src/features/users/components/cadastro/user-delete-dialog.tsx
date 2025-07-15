import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useDeleteUser } from 'src/features/users/hooks/use-delete-user';
import { useUserCadastroStore } from 'src/features/users/stores/user-cadastro-store';

export const UserDeleteDialog = () => {
  const { isDeleteDialogOpen, selectedUser, closeDeleteDialog } = useUserCadastroStore();
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

  const handleDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      closeDeleteDialog();
    }
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        Tem certeza que deseja excluir &quot;{selectedUser.nome}&quot;? Esta ação não pode ser
        desfeita.
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={isPending}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
