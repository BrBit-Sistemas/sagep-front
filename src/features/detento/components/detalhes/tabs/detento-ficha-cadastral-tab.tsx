import type { Detento } from 'src/features/detento/types';

import Grid from '@mui/material/Grid';

import { useSuspenseGetDetentoFichasCadastrais } from 'src/features/detento/hooks/use-get-detento-fichas-cadastrais';

import { DetentoFichaCadastralCard } from '../detento-ficha-cadastral-card';
import { DetentoFichaCadastralAddCard } from '../detento-ficha-cadastral-add-card';

interface DetentoFichaCadastralTabProps {
  detento: Detento;
}

export const DetentoFichaCadastralTab = ({ detento }: DetentoFichaCadastralTabProps) => {
  const { data: fichasCadastrais } = useSuspenseGetDetentoFichasCadastrais(detento.id);

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {fichasCadastrais.map((fichaCadastral) => (
        <Grid size={{ xs: 12, md: 3 }} key={fichaCadastral.fichacadastral_id}>
          <DetentoFichaCadastralCard fichaCadastral={fichaCadastral} />
        </Grid>
      ))}
      <Grid size={{ xs: 12, md: 3 }}>
        <DetentoFichaCadastralAddCard detentoId={detento.id} />
      </Grid>
    </Grid>
  );
};
