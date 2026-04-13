import { useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useRevalidar } from '../hooks/use-revalidar';
import { useValidacaoStore } from '../stores/validacao-store';

type Props = {
  fichaId: string;
  detentoNome: string;
};

export const RevalidarMotivoDialog = ({ fichaId, detentoNome }: Props) => {
  const { isRevalidarOpen, closeRevalidar, closeDetails } = useValidacaoStore();
  const { mutateAsync, isPending } = useRevalidar();

  const [motivo, setMotivo] = useState('');
  const [touched, setTouched] = useState(false);

  const error = touched && motivo.trim().length < 3;

  const handleConfirm = async () => {
    if (motivo.trim().length < 3) {
      setTouched(true);
      return;
    }
    await mutateAsync({ fichaId, data: { motivo: motivo.trim() } });
    setMotivo('');
    setTouched(false);
    closeRevalidar();
    closeDetails();
  };

  const handleClose = () => {
    setMotivo('');
    setTouched(false);
    closeRevalidar();
  };

  return (
    <Dialog open={isRevalidarOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Revalidar ficha</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reeducando: <Box component="span" sx={{ fontWeight: 600 }}>{detentoNome}</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Revalidar reabre a validação: a ficha volta para <b>PENDENTE</b> e sai da fila se estiver
          aprovada.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          label="Motivo da revalidação"
          placeholder="Ex.: atualização de artigos penais; nova decisão judicial."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          onBlur={() => setTouched(true)}
          error={error}
          helperText={error ? 'Motivo é obrigatório (mín. 3 caracteres).' : 'Registrado no histórico.'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="warning" loading={isPending}>
          Revalidar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
