import type { Detento } from 'src/features/detento/types';

import Button from '@mui/material/Button';

import { useDetentoDetalhesStore } from 'src/features/detento/stores/detento-detalhes-store';

import { DetentoFichaCadastralDialogForm } from '../detento-ficha-cadastral-dialog-form';

interface DetentoFichaCadastralTabProps {
  detento: Detento;
}

export const DetentoFichaCadastralTab = ({ detento }: DetentoFichaCadastralTabProps) => {
  const { isFichaCadastralDialogOpen, closeFichaCadastralDialog, openFichaCadastralCreateDialog } =
    useDetentoDetalhesStore();

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => openFichaCadastralCreateDialog()}>
        Adicionar Ficha Cadastral
      </Button>
      <DetentoFichaCadastralDialogForm
        detentoId={detento.detento_id}
        open={isFichaCadastralDialogOpen}
        onClose={closeFichaCadastralDialog}
      />
    </div>
  );
};
