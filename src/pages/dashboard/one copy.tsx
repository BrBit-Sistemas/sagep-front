import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDashboardMetrics } from 'src/features/dashboard/hooks/use-dashboard-metrics';

import { Iconify, type IconifyName } from 'src/components/iconify';

type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

type StatusMetric = {
  label: string;
  value: number;
  color: PaletteColorKey;
};

const STATUS_CONFIGURATION: Record<string, { label: string; color: PaletteColorKey }> = {
  ATIVO: { label: 'Ativos', color: 'success' },
  SUSPENSO: { label: 'Suspensos', color: 'warning' },
  ENCERRADO: { label: 'Encerrados', color: 'error' },
  RASCUNHO: { label: 'Rascunhos', color: 'info' },
};

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard | ${CONFIG.appName}` };

const SummaryCard = ({
  title,
  value,
  icon,
  color = 'primary',
  isLoading = false,
  shareLabel,
  shareValue,
}: {
  title: string;
  value: number;
  icon: IconifyName;
  color?: PaletteColorKey;
  isLoading?: boolean;
  shareLabel?: string;
  shareValue?: number;
}) => {
  const theme = useTheme();
  const paletteColor = theme.palette[color as PaletteColorKey];
  const percentage = Math.min(Math.max(shareValue ?? 0, 0), 100);

  return (
    <Card sx={{ height: '100%', boxShadow: 8, borderRadius: 2 }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {title}
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={120} sx={{ fontSize: '2.75rem' }} />
              ) : (
                <Typography variant="h3">{value.toLocaleString('pt-BR')}</Typography>
              )}
            </Stack>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                color: paletteColor.main,
                bgcolor: alpha(paletteColor.main, 0.12),
                display: 'inline-flex',
              }}
            >
              <Iconify icon={icon} width={28} />
            </Box>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          {isLoading ? (
            <Stack spacing={1} sx={{ flexGrow: 1, justifyContent: 'center' }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={6} sx={{ borderRadius: 6 }} />
              <Skeleton variant="text" width="40%" />
            </Stack>
          ) : (
            <Stack spacing={1} sx={{ flexGrow: 1, justifyContent: 'center' }}>
              {shareLabel ? (
                <Typography variant="caption" color="text.secondary">
                  {shareLabel}
                </Typography>
              ) : null}
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 6,
                  borderRadius: 6,
                  bgcolor: alpha(paletteColor.main, 0.12),
                  '& .MuiLinearProgress-bar': { bgcolor: paletteColor.main },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {shareValue !== undefined
                  ? `${percentage.toFixed(1).replace('.', ',')}% do total consolidado`
                  : 'Acompanhamento contínuo'}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const ConveniosStatusCard = ({ data, isLoading }: { data: StatusMetric[]; isLoading: boolean }) => {
  const theme = useTheme();
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card sx={{ height: '100%', boxShadow: 8, borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Convênios por status
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={160} sx={{ fontSize: '1.5rem' }} />
              ) : (
                <Typography variant="h5">
                  {total.toLocaleString('pt-BR')} convênio{total === 1 ? '' : 's'}
                </Typography>
              )}
            </Stack>
            <Box 
              sx={{
                p: 1.5,
                borderRadius: '50%',
                color: theme.palette.info.main,
                bgcolor: alpha(theme.palette.info.main, 0.12),
                display: 'inline-flex',
              }}
            >
              <Iconify icon="solar:chart-square-outline" width={28} />
            </Box>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack spacing={2}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Stack key={index} spacing={0.5}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="rectangular" height={6} sx={{ borderRadius: 6 }} />
                  </Stack>
                ))
              : data.length === 0
                ? (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum convênio encontrado.
                    </Typography>
                  )
                : (
                    data.map((status) => {
                      const paletteColor = theme.palette[status.color as PaletteColorKey];
                      const percentage = total ? Math.round((status.value / total) * 100) : 0;

                      return (
                        <Stack key={status.label} spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">{status.label}</Typography>
                            <Typography variant="subtitle2">{status.value}</Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 6,
                              borderRadius: 6,
                              bgcolor: alpha(paletteColor.main, 0.16),
                              '& .MuiLinearProgress-bar': { bgcolor: paletteColor.main },
                            }}
                          />
                        </Stack>
                      );
                    })
                  )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const { data, isLoading, isError, error } = useDashboardMetrics();

  const conveniosStatusData = useMemo<StatusMetric[]>(() => {
    if (!data?.conveniosPorStatus) {
      return [];
    }

    return data.conveniosPorStatus.map(({ status, total }) => {
      const config = STATUS_CONFIGURATION[status] ?? {
        label: status,
        color: 'primary' as PaletteColorKey,
      };

      return {
        label: config.label,
        color: config.color,
        value: total ?? 0,
      };
    });
  }, [data?.conveniosPorStatus]);

  const totalReeducandos = data?.totalReeducandosAtivos ?? 0;
  const totalEmpresas = data?.totalEmpresasAtivas ?? 0;
  const totalConvenios = conveniosStatusData.reduce((acc, item) => acc + item.value, 0);
  const totalConsolidado = totalReeducandos + totalEmpresas + totalConvenios;
  const computeShare = (value: number) => (totalConsolidado ? (value / totalConsolidado) * 100 : 0);
  const errorMessage = error instanceof Error ? error.message : 'Tente novamente em instantes.';

  return (
    <>
      <title>{metadata.title}</title>

      <DashboardContent sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={5}>
          <Stack spacing={1}>
            <Typography variant="h4">Visão geral</Typography>
            <Typography variant="body2" color="text.secondary">
              Bem-vindo ao painel principal do SAGEP. Os indicadores abaixo refletem os dados
              consolidados em tempo real.
            </Typography>
          </Stack>

          {isError && (
            <Alert severity="error" sx={{ mb: -2 }}>
              Não foi possível carregar as métricas do dashboard. {errorMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <SummaryCard
                title="Reeducandos ativos"
                value={totalReeducandos}
                icon="solar:users-group-rounded-bold"
                color="success"
                isLoading={isLoading}
                shareLabel="Participação entre indicadores"
                shareValue={computeShare(totalReeducandos)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <SummaryCard
                title="Empresas ativas"
                value={totalEmpresas}
                icon="solar:case-minimalistic-bold"
                color="info"
                isLoading={isLoading}
                shareLabel="Participação entre indicadores"
                shareValue={computeShare(totalEmpresas)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <ConveniosStatusCard data={conveniosStatusData} isLoading={isLoading} />
            </Grid>
          </Grid>
        </Stack>
      </DashboardContent>
    </>
  );
}
