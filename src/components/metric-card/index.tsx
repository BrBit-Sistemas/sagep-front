import type { ComponentProps } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Box, Card, Stack, Skeleton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type MetricCardTone = 'neutral' | 'success' | 'error' | 'warning' | 'primary';

export type MetricCardProps = {
  label: string;
  value: number | undefined;
  icon?: ComponentProps<typeof Iconify>['icon'];
  tone?: MetricCardTone;
  loading?: boolean;
  /** Marca o card como ativo (ex.: quando o filtro de status atual está selecionado nele). */
  active?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
};

const toneColorMap: Record<MetricCardTone, string> = {
  neutral: 'text.secondary',
  success: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
  primary: 'primary.main',
};

const toneBgMap: Record<MetricCardTone, (theme: Theme) => string> = {
  neutral: (t) => t.palette.action.hover,
  success: (t) => (t.vars || t).palette.success.lighter || t.palette.success.light,
  error: (t) => (t.vars || t).palette.error.lighter || t.palette.error.light,
  warning: (t) => (t.vars || t).palette.warning.lighter || t.palette.warning.light,
  primary: (t) => (t.vars || t).palette.primary.lighter || t.palette.primary.light,
};

export const MetricCard = ({
  label,
  value,
  icon = 'solar:file-bold-duotone',
  tone = 'neutral',
  loading,
  active,
  onClick,
  sx,
}: MetricCardProps) => {
  const clickable = Boolean(onClick);
  return (
    <Card
      onClick={onClick}
      sx={[
        {
          p: 2.5,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          minHeight: 92,
          cursor: clickable ? 'pointer' : 'default',
          transition: (t) => t.transitions.create(['border-color', 'background-color', 'box-shadow'], { duration: 150 }),
          border: (t) => `2px solid ${active ? t.palette[tone === 'neutral' ? 'primary' : tone].main : 'transparent'}`,
          '&:hover': clickable
            ? {
                bgcolor: (t) => t.palette.action.hover,
              }
            : undefined,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={(theme) => ({
          width: 48,
          height: 48,
          borderRadius: 1.5,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: toneBgMap[tone](theme),
          color: toneColorMap[tone],
          flexShrink: 0,
        })}
      >
        <Iconify icon={icon} width={26} />
      </Box>
      <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={56} height={34} />
        ) : (
          <Typography variant="h4" sx={{ color: toneColorMap[tone], lineHeight: 1.1 }}>
            {(value ?? 0).toLocaleString('pt-BR')}
          </Typography>
        )}
      </Stack>
    </Card>
  );
};
