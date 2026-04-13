import type { ChipProps } from '@mui/material';
import type { StatusValidacaoFicha } from '../types';

import { Chip } from '@mui/material';

type Props = {
  status: StatusValidacaoFicha;
  size?: ChipProps['size'];
  sx?: ChipProps['sx'];
};

const LABEL: Record<StatusValidacaoFicha, string> = {
  AGUARDANDO_VALIDACAO: 'Pendente',
  VALIDADO: 'Aprovado',
  REQUER_CORRECAO: 'Requer correção',
  FILA_DISPONIVEL: 'Na fila',
};

const COLOR: Record<StatusValidacaoFicha, ChipProps['color']> = {
  AGUARDANDO_VALIDACAO: 'default',
  VALIDADO: 'success',
  REQUER_CORRECAO: 'error',
  FILA_DISPONIVEL: 'primary',
};

export const StatusChip = ({ status, size = 'small', sx }: Props) => (
  <Chip
    size={size}
    color={COLOR[status]}
    variant={status === 'AGUARDANDO_VALIDACAO' ? 'outlined' : 'filled'}
    label={LABEL[status] ?? status}
    sx={{ fontWeight: 600, ...sx }}
  />
);
