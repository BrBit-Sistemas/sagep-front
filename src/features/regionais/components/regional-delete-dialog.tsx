import {
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useRegionalCadastroStore } from '../stores';
import { useDeleteRegional } from '../hooks/use-delete-regional';

export const RegionalDeleteDialog = () => {
  const { isDeleteDialogOpen, selectedRegional, closeDeleteDialog } = useRegionalCadastroStore();
  const { mutateAsync: deleteRegional, isPending } = useDeleteRegional();

  const handleDelete = async () => {
    if (selectedRegional) {
      await deleteRegional(selectedRegional.id);
      closeDeleteDialog();
    }
  };

  if (!selectedRegional) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir &ldquo;{selectedRegional.nome}&rdquo;? Esta ação não pode
          ser desfeita.
        </Typography>
        {selectedRegional.unidades && selectedRegional.unidades.length > 0 && (
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            ⚠️ Esta regional possui {selectedRegional.unidades.length} unidade(s) prisional(is)
            vinculada(s).
          </Typography>
        )}
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
