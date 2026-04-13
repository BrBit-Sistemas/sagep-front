import type { ChipProps } from '@mui/material';
import type { ValidacaoStatus } from '../types';

import { Chip } from '@mui/material';

type Props = {
  status: ValidacaoStatus;
  size?: ChipProps['size'];
  sx?: ChipProps['sx'];
};

const LABEL: Record<ValidacaoStatus, string> = {
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  ALERTA: 'Alerta',
  PENDENTE: 'Pendente',
};

const COLOR: Record<ValidacaoStatus, ChipProps['color']> = {
  APROVADO: 'success',
  REPROVADO: 'error',
  ALERTA: 'warning',
  PENDENTE: 'default',
};

export const StatusChip = ({ status, size = 'small', sx }: Props) => (
  <Chip
    size={size}
    color={COLOR[status]}
    variant={status === 'PENDENTE' ? 'outlined' : 'filled'}
    label={LABEL[status]}
    sx={{ fontWeight: 600, ...sx }}
  />
);
