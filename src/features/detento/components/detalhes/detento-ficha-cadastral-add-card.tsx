import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { Iconify } from 'src/components/iconify';

import { useDetentoDetalhesStore } from '../../stores/detento-detalhes-store';

export const DetentoFichaCadastralAddCard = () => {
  const { openFichaCadastralCreateDialog } = useDetentoDetalhesStore();

  const handleCreate = () => {
    openFichaCadastralCreateDialog();
  };

  return (
    <Card sx={{ aspectRatio: 1 }}>
      <CardActionArea
        onClick={handleCreate}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          color: 'primary.main',
        }}
      >
        <Iconify icon="solar:add-circle-bold" width={48} height={48} color="primary" />
        <Typography variant="h6">Nova Ficha Cadastral</Typography>
      </CardActionArea>
    </Card>
  );
};
