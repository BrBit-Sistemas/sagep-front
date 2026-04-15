import type { ChipProps } from '@mui/material';
import type { StatusValidacaoFicha } from 'src/api/fichas-cadastrais';

import { Chip } from '@mui/material';

export type FichaStatusChipValue = StatusValidacaoFicha | 'SEM_FICHA';

type Props = {
  status: FichaStatusChipValue | null | undefined;
  size?: ChipProps['size'];
  sx?: ChipProps['sx'];
};

const LABEL: Record<FichaStatusChipValue, string> = {
  AGUARDANDO_VALIDACAO: 'Aguardando validação',
  VALIDADO: 'Aprovado',
  REQUER_CORRECAO: 'Requer correção',
  FILA_DISPONIVEL: 'Na fila',
  SEM_FICHA: 'Sem ficha',
};

const COLOR: Record<FichaStatusChipValue, ChipProps['color']> = {
  AGUARDANDO_VALIDACAO: 'warning',
  VALIDADO: 'success',
  REQUER_CORRECAO: 'error',
  FILA_DISPONIVEL: 'primary',
  SEM_FICHA: 'default',
};

export const StatusChip = ({ status, size = 'small', sx }: Props) => {
  if (!status) {
    return (
      <Chip
        size={size}
        variant="outlined"
        color="default"
        label="—"
        sx={{ fontWeight: 600, ...sx }}
      />
    );
  }
  return (
    <Chip
      size={size}
      color={COLOR[status]}
      variant={status === 'SEM_FICHA' || status === 'AGUARDANDO_VALIDACAO' ? 'outlined' : 'filled'}
      label={LABEL[status] ?? status}
      sx={{ fontWeight: 600, ...sx }}
    />
  );
};
