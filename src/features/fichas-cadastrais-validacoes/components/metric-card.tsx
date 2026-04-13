import type { ComponentProps } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Box, Card, Stack, Skeleton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

type Tone = 'neutral' | 'success' | 'error' | 'warning';

type Props = {
  label: string;
  value: number | undefined;
  icon?: ComponentProps<typeof Iconify>['icon'];
  tone?: Tone;
  loading?: boolean;
  sx?: SxProps<Theme>;
};

const toneColorMap: Record<Tone, string> = {
  neutral: 'text.secondary',
  success: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
};

const toneBgMap: Record<Tone, (theme: Theme) => string> = {
  neutral: (t) => t.palette.action.hover,
  success: (t) => (t.vars || t).palette.success.lighter || t.palette.success.light,
  error: (t) => (t.vars || t).palette.error.lighter || t.palette.error.light,
  warning: (t) => (t.vars || t).palette.warning.lighter || t.palette.warning.light,
};

export const MetricCard = ({
  label,
  value,
  icon = 'solar:file-bold-duotone',
  tone = 'neutral',
  loading,
  sx,
}: Props) => (
  <Card
    sx={[
      {
        p: 2.5,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        minHeight: 92,
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
