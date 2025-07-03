import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useDeleteProfissao } from '../../hooks/use-delete-profissao';
import { useProfissaoCadastroStore } from '../../stores/profissao-cadastro-store';

export const ProfissaoDeleteDialog = () => {
  const { isDeleteDialogOpen, selectedProfissao, closeDeleteDialog } = useProfissaoCadastroStore();
  const { mutateAsync: deleteProfissao, isPending } = useDeleteProfissao();

  const handleDelete = async () => {
    if (selectedProfissao) {
      await deleteProfissao(selectedProfissao.profissao_id);
      closeDeleteDialog();
    }
  };

  if (!selectedProfissao) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        Tem certeza que deseja excluir &quot;{selectedProfissao.nome}&quot;? Esta ação não pode ser
        desfeita.
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
