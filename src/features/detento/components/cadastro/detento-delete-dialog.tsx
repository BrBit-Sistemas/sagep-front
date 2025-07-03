import Button from '@mui/material/Button';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { useDeleteDetento } from '../../hooks/use-delete-detento';
import { useDetentoCadastroStore } from '../../stores/detento-cadastro-store';

export const DetentoDeleteDialog = () => {
  const { isDeleteDialogOpen, closeDeleteDialog, selectedDetento } = useDetentoCadastroStore();
  const { mutateAsync: deleteDetento, isPending } = useDeleteDetento();

  const handleDeleteDetento = async () => {
    if (!selectedDetento) return;
    await deleteDetento(selectedDetento.detento_id);
    closeDeleteDialog();
  };

  return (
    <ConfirmDialog
      open={isDeleteDialogOpen}
      onClose={closeDeleteDialog}
      title="Excluir detento"
      content={`Tem certeza que deseja deletar o detento ${selectedDetento?.nome}?`}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteDetento}
          disabled={isPending}
          loading={isPending}
        >
          Excluir
        </Button>
      }
    />
  );
};
