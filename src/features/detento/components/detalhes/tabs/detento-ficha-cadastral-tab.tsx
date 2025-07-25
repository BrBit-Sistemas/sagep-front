import type { Detento } from 'src/features/detento/types';

import Grid from '@mui/material/Grid';

import { fichaCadastralToFormValues } from 'src/features/detento/helper';
import { useDetentoDetalhesStore } from 'src/features/detento/stores/detento-detalhes-store';
import { useSuspenseGetDetentoFichasCadastrais } from 'src/features/detento/hooks/use-get-detento-fichas-cadastrais';

import { DetentoFichaCadastralCard } from '../detento-ficha-cadastral-card';
import { DetentoFichaCadastralAddCard } from '../detento-ficha-cadastral-add-card';
import { DetentoFichaCadastralDialogForm } from '../detento-ficha-cadastral-dialog-form';

interface DetentoFichaCadastralTabProps {
  detento: Detento;
}

export const DetentoFichaCadastralTab = ({ detento }: DetentoFichaCadastralTabProps) => {
  const { isFichaCadastralDialogOpen, closeFichaCadastralDialog, selectedFichaCadastral } =
    useDetentoDetalhesStore();
  const { data: fichasCadastrais } = useSuspenseGetDetentoFichasCadastrais(detento.detento_id);

  return (
    <>
      <DetentoFichaCadastralDialogForm
        detento={detento}
        detentoId={detento.detento_id}
        open={isFichaCadastralDialogOpen}
        onClose={closeFichaCadastralDialog}
        {...(selectedFichaCadastral && {
          defaultValues: fichaCadastralToFormValues(selectedFichaCadastral),
          fichaCadastralId: selectedFichaCadastral.fichacadastral_id,
        })}
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {fichasCadastrais.map((fichaCadastral) => (
          <Grid size={{ xs: 12, md: 3 }} key={fichaCadastral.fichacadastral_id}>
            <DetentoFichaCadastralCard fichaCadastral={fichaCadastral} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 3 }}>
          <DetentoFichaCadastralAddCard />
        </Grid>
      </Grid>
    </>
  );
};
