import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useValidacaoStore } from '../stores/validacao-store';
import { useIniciarAnalise } from '../hooks/use-iniciar-analise';

type Props = {
  fichaId: string;
  detentoNome: string;
};

export const RevalidarDialog = ({ fichaId, detentoNome }: Props) => {
  const { isRevalidarOpen, closeRevalidar, closeDetails } = useValidacaoStore();
  const { mutateAsync, isPending } = useIniciarAnalise();

  const handleConfirm = async () => {
    await mutateAsync(fichaId);
    closeRevalidar();
    closeDetails();
  };

  return (
    <Dialog open={isRevalidarOpen} onClose={closeRevalidar} fullWidth maxWidth="sm">
      <DialogTitle>Reabrir análise</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reeducando:{' '}
          <Box component="span" sx={{ fontWeight: 600 }}>
            {detentoNome}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A ficha volta para <b>AGUARDANDO_VALIDACAO</b>. Se estiver aprovada ou na fila, sai da
          fila automaticamente.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeRevalidar} variant="outlined" disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="warning" loading={isPending}>
          Reabrir análise
        </Button>
      </DialogActions>
    </Dialog>
  );
};
