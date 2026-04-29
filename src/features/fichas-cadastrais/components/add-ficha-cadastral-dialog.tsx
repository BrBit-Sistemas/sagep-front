import { useState, useCallback } from 'react';

import {
  Alert,
  Stack,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fichasCadastraisService } from '../data';

type Props = {
  open: boolean;
  onClose: () => void;
};

function isValidCPF(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(d[i], 10) * (10 - i);
  let v = (s * 10) % 11;
  if (v >= 10) v = 0;
  if (v !== parseInt(d[9], 10)) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(d[i], 10) * (11 - i);
  v = (s * 10) % 11;
  if (v >= 10) v = 0;
  return v === parseInt(d[10], 10);
}

function formatCPF(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function AddFichaCadastralDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawCpf = cpf.replace(/\D/g, '');
  const isCpfComplete = rawCpf.length === 11;
  const isCpfValid = isCpfComplete && isValidCPF(rawCpf);

  const handleClose = useCallback(() => {
    setCpf('');
    setError(null);
    onClose();
  }, [onClose]);

  const handleCheck = useCallback(async () => {
    if (!isCpfValid) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fichasCadastraisService.validateCpf(rawCpf);
      if (result.status === 'no_detento') {
        setError(
          'Nenhum reeducando encontrado com este CPF. Cadastre o reeducando na tela de Reeducandos antes de criar uma ficha cadastral.'
        );
        return;
      }
      if (result.status === 'has_active_fc') {
        setError(
          'Este reeducando já possui uma ficha cadastral ativa. O sistema só permite uma ficha cadastral ativa por reeducando.'
        );
        return;
      }
      router.push(paths.carceragem.reeducandos.fichaCadastralNew(result.detento_id!));
      handleClose();
    } catch {
      setError('Erro ao verificar CPF. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [isCpfValid, rawCpf, router, handleClose]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isCpfValid && !loading) handleCheck();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Nova Ficha Cadastral</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="CPF do reeducando"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            onKeyDown={handleKeyDown}
            inputProps={{ maxLength: 14 }}
            error={isCpfComplete && !isCpfValid}
            helperText={isCpfComplete && !isCpfValid ? 'CPF inválido' : ' '}
            fullWidth
            autoFocus
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleCheck}
          disabled={!isCpfValid || loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
