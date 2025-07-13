import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useDeleteUnidadePrisional } from '../../hooks/use-delete-unidade-prisional';
import { useUnidadePrisionalCadastroStore } from '../../stores/unidade-prisional-cadastro-store';

export const UnidadePrisionalDeleteDialog = () => {
  const { isDeleteDialogOpen, selectedUnidadePrisional, closeDeleteDialog } =
    useUnidadePrisionalCadastroStore();
  const { mutateAsync: deleteUnidadePrisional, isPending } = useDeleteUnidadePrisional();

  const handleDelete = async () => {
    if (selectedUnidadePrisional) {
      await deleteUnidadePrisional(selectedUnidadePrisional.id);
      closeDeleteDialog();
    }
  };

  if (!selectedUnidadePrisional) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        Tem certeza que deseja excluir &quot;{selectedUnidadePrisional.nome}&quot;? Esta ação não
        pode ser desfeita.
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
