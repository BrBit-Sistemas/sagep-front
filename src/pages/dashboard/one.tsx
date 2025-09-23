import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify, type IconifyName } from 'src/components/iconify';

type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard | ${CONFIG.appName}` };

const mockedMetrics = {
  activeReeducandos: 428,
  activeCompanies: 67,
  conveniosByStatus: [
    { label: 'Ativos', value: 18, color: 'success' as PaletteColorKey },
    { label: 'Em análise', value: 7, color: 'warning' as PaletteColorKey },
    { label: 'Encerrados', value: 4, color: 'error' as PaletteColorKey },
  ],
};

const SummaryCard = ({
  title,
  value,
  icon,
  color = 'primary',
}: {
  title: string;
  value: number;
  icon: IconifyName;
  color?: PaletteColorKey;
}) => {
  const theme = useTheme();
  const paletteColor = theme.palette[color as PaletteColorKey];

  return (
    <Card sx={{ height: '100%', boxShadow: 8, borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h3">{value.toLocaleString('pt-BR')}</Typography>
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
        </Stack>
      </CardContent>
    </Card>
  );
};

const ConveniosStatusCard = () => {
  const theme = useTheme();
  const total = mockedMetrics.conveniosByStatus.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card sx={{ height: '100%', boxShadow: 8, borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Convênios por status
              </Typography>
              <Typography variant="h5">{total.toLocaleString('pt-BR')} convênios</Typography>
            </Stack>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '100%',
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
            {mockedMetrics.conveniosByStatus.map((status) => {
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
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <DashboardContent sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={5}>
          <Stack spacing={1}>
            <Typography variant="h4">Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Bem-vindo ao painel principal do NOVO SUPER SAGEP
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryCard
                title="Reeducandos ativos"
                value={mockedMetrics.activeReeducandos}
                icon="solar:users-group-rounded-bold"
                color="success"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryCard
                title="Empresas ativas"
                value={mockedMetrics.activeCompanies}
                icon="solar:case-minimalistic-bold"
                color="info"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <ConveniosStatusCard />
            </Grid>
          </Grid>
        </Stack>
      </DashboardContent>
    </>
  );
}
