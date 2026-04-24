import { useState } from 'react';

import {
  Box,
  Alert,
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { useValidacaoStore } from '../stores/validacao-store';
import { useRequererCorrecao } from '../hooks/use-requerer-correcao';
import { MOTIVOS_REPROVACAO } from '../constants/motivos-reprovacao';

type Props = {
  fichaId: string;
  detentoNome: string;
};

export const RequererCorrecaoDialog = ({ fichaId, detentoNome }: Props) => {
  const { isReprovarOpen, closeReprovar, closeDetails } = useValidacaoStore();
  const { mutateAsync, isPending } = useRequererCorrecao();

  const [motivo, setMotivo] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');
  const [touched, setTouched] = useState(false);

  const motivoText = motivo?.trim() ?? '';
  const observacaoText = observacao.trim();
  const motivoCompleto = observacaoText ? `${motivoText} - ${observacaoText}` : motivoText;
  const error = touched && motivoText.length < 3;

  const handleConfirm = async () => {
    if (motivoText.length < 3) {
      setTouched(true);
      return;
    }
    await mutateAsync({ fichaId, motivo: motivoCompleto });
    setMotivo(null);
    setObservacao('');
    setTouched(false);
    closeReprovar();
    closeDetails();
  };

  const handleClose = () => {
    setMotivo(null);
    setObservacao('');
    setTouched(false);
    closeReprovar();
  };

  return (
    <Dialog open={isReprovarOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:close-circle-bold" width={24} />
          <span>Reprovar ficha cadastral</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reeducando:{' '}
          <Box component="span" sx={{ fontWeight: 600 }}>
            {detentoNome}
          </Box>
        </Typography>

        <Alert
          severity="warning"
          variant="outlined"
          sx={{ mb: 2 }}
          icon={<Iconify icon="solar:danger-triangle-bold" />}
        >
          A decisão registra o motivo na ficha e retira a ficha do fluxo de validação aprovado.
        </Alert>

        <Stack spacing={2}>
          <Autocomplete
            autoHighlight
            options={[...MOTIVOS_REPROVACAO]}
            value={motivo}
            onChange={(_, value) => {
              setMotivo(value);
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                label="Motivo da reprovação"
                placeholder="Selecione um motivo"
                error={error}
                helperText={
                  error
                    ? 'Selecione um motivo para reprovar a ficha.'
                    : 'Use a lista padronizada para manter o histórico consistente.'
                }
              />
            )}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Observação complementar"
            placeholder="Detalhe a pendência quando precisar, por exemplo número do documento ou contexto da consulta."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            helperText="Opcional. Será salvo junto ao motivo selecionado."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" loading={isPending}>
          Reprovar ficha
        </Button>
      </DialogActions>
    </Dialog>
  );
};
