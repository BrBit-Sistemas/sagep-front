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

import { useValidar } from '../hooks/use-validar';
import { useValidacaoStore } from '../stores/validacao-store';

type Props = {
  fichaId: string;
  detentoNome: string;
};

export const ReprovarMotivoDialog = ({ fichaId, detentoNome }: Props) => {
  const { isReprovarOpen, closeReprovar, closeDetails } = useValidacaoStore();
  const { mutateAsync, isPending } = useValidar();

  const [motivo, setMotivo] = useState('');
  const [touched, setTouched] = useState(false);

  const error = touched && motivo.trim().length < 3;

  const handleConfirm = async () => {
    if (motivo.trim().length < 3) {
      setTouched(true);
      return;
    }
    await mutateAsync({
      fichaId,
      data: { decisao: 'REPROVADO', motivo_rejeicao: motivo.trim() },
    });
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
      <DialogTitle>Reprovar ficha</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reeducando: <Box component="span" sx={{ fontWeight: 600 }}>{detentoNome}</Box>
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          label="Motivo da reprovação"
          placeholder="Ex.: artigo vedado para trabalho externo; documentação pendente."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          onBlur={() => setTouched(true)}
          error={error}
          helperText={
            error ? 'Motivo é obrigatório (mín. 3 caracteres).' : 'Visível na listagem e no histórico.'
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" loading={isPending}>
          Reprovar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
