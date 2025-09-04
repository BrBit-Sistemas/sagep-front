import { Button, Dialog, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useDeleteEmpresaConvenio } from '../../hooks/use-delete-empresa-convenio';
import { useEmpresaConvenioCadastroStore } from '../../stores/empresa-convenio-cadastro-store';

export const EmpresaConvenioDeleteDialog = () => {
  const { isDeleteDialogOpen, selected, closeDeleteDialog } = useEmpresaConvenioCadastroStore();
  const { mutateAsync: deleteItem, isPending } = useDeleteEmpresaConvenio();

  const onConfirm = async () => {
    if (!selected) return;
    await deleteItem(selected.convenio_id);
    closeDeleteDialog();
  };

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Excluir Convênio</DialogTitle>
      <DialogContent>
        <Typography>Tem certeza que deseja excluir este convênio?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={closeDeleteDialog}>
          Cancelar
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isPending}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
