import {
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useProfissaoCadastroStore } from '../../stores';
import { useDeleteProfissao } from '../../hooks/use-delete-profissao';

export function ProfissaoDeleteDialog() {
  const { selectedProfissao, isDeleteDialogOpen, closeDeleteDialog } = useProfissaoCadastroStore();

  const deleteMutation = useDeleteProfissao();

  const handleDelete = async () => {
    if (!selectedProfissao) return;

    await deleteMutation.mutateAsync(selectedProfissao.id);
    closeDeleteDialog();
  };

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir a profissão &quot;{selectedProfissao?.nome}?&quot; Esta
          ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} disabled={deleteMutation.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
