import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

type DetentoFichaCadastralAddCardProps = {
  detentoId: string;
};

export const DetentoFichaCadastralAddCard = ({ detentoId }: DetentoFichaCadastralAddCardProps) => {
  const navigate = useRouter();
  const { hasPermission } = usePermissionCheck();

  // Permission
  const canCreate = hasPermission({ action: 'create', subject: 'ficha_cadastral_interno' });

  const handleCreate = () => {
    if (!canCreate) return;
    navigate.push(paths.detentos.fichaCadastralNew(detentoId));
  };

  if (!canCreate) {
    return null;
  }

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
