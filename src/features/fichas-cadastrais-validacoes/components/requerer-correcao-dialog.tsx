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

import { useValidacaoStore } from '../stores/validacao-store';
import { useRequererCorrecao } from '../hooks/use-requerer-correcao';

type Props = {
  fichaId: string;
  detentoNome: string;
};

export const RequererCorrecaoDialog = ({ fichaId, detentoNome }: Props) => {
  const { isReprovarOpen, closeReprovar, closeDetails } = useValidacaoStore();
  const { mutateAsync, isPending } = useRequererCorrecao();

  const [motivo, setMotivo] = useState('');
  const [touched, setTouched] = useState(false);

  const error = touched && motivo.trim().length < 3;

  const handleConfirm = async () => {
    if (motivo.trim().length < 3) {
      setTouched(true);
      return;
    }
    await mutateAsync({ fichaId, motivo: motivo.trim() });
    setMotivo('');
    setTouched(false);
    closeReprovar();
    closeDetails();
  };

  const handleClose = () => {
    setMotivo('');
    setTouched(false);
    closeReprovar();
  };

  return (
    <Dialog open={isReprovarOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Requerer correção</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reeducando:{' '}
          <Box component="span" sx={{ fontWeight: 600 }}>
            {detentoNome}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A ficha volta para <b>REQUER_CORRECAO</b>. O motivo fica registrado no histórico.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          label="Motivo da correção"
          placeholder="Ex.: documentação incompleta; artigo vedado para trabalho externo."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          onBlur={() => setTouched(true)}
          error={error}
          helperText={
            error
              ? 'Motivo é obrigatório (mín. 3 caracteres).'
              : 'Visível na listagem e no detalhe da ficha.'
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" loading={isPending}>
          Requerer correção
        </Button>
      </DialogActions>
    </Dialog>
  );
};
