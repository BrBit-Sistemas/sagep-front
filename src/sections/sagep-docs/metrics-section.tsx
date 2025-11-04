import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const METRICS = [
  { value: '2.500+', label: 'Reeducandos Cadastrados', icon: 'solar:users-group-two-rounded-bold', color: 'primary', trend: '+12% mês' },
  { value: '450+', label: 'Vagas Ativas em Convênios', icon: 'solar:case-round-bold', color: 'success', trend: '+8% mês' },
  { value: '1.200+', label: 'Alocações Realizadas', icon: 'solar:star-bold', color: 'warning', trend: 'Acumulado' },
  { value: '92%', label: 'Taxa de Precisão do Algoritmo', icon: 'solar:graph-up-bold', color: 'info', trend: 'Matches aceitos' },
];

// ----------------------------------------------------------------------

export function MetricsSection() {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Typography variant="h2" align="center" sx={{ mb: 2 }}>
        📊 Métricas e KPIs em Tempo Real
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Acompanhe o desempenho do sistema com indicadores inteligentes
      </Typography>
      
      <Grid container spacing={3}>
        {METRICS.map((metric, index) => (
          <Grid key={index} size={{ md: 3, sm: 6, xs: 12 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" color={`${metric.color}.main`}>{metric.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${metric.color}.lighter`, width: 56, height: 56 }}>
                    <Iconify icon={metric.icon as any} width={32} />
                  </Avatar>
                </Stack>
                <Typography variant="subtitle2" color="success.main" sx={{ mt: 2 }}>{metric.trend}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

