import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useDeleteEmpresa } from '../../hooks/use-delete-empresa';
import { useEmpresaCadastroStore } from '../../stores/empresa-cadastro-store';

export const EmpresaDeleteDialog = () => {
  const { isDeleteDialogOpen, selectedEmpresa, closeDeleteDialog } = useEmpresaCadastroStore();
  const { mutateAsync: deleteEmpresa, isPending } = useDeleteEmpresa();

  const handleDelete = async () => {
    if (selectedEmpresa) {
      await deleteEmpresa(selectedEmpresa.empresa_id);
      closeDeleteDialog();
    }
  };

  if (!selectedEmpresa) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        Tem certeza que deseja excluir &quot;{selectedEmpresa.razao_social}&quot;? Esta ação não
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
