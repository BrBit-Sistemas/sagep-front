import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: 'solar:target-bold',
    color: 'primary',
    title: '🎯 Matching Simplificado',
    description: 'Algoritmo focado em 2 critérios essenciais: Tempo de espera (70% - FIFO rigoroso) e proximidade geográfica (30% - CEP). Reduz tempo de alocação de 2 horas para 5 minutos (96% mais rápido). Score de compatibilidade 0-100% com ranking automático dos Top 5 candidatos.',
    chips: ['⏱️ FIFO 70%', '📍 CEP 30%', '⚡ Ultra-Rápido'],
  },
  {
    icon: 'solar:shield-check-bold',
    color: 'error',
    title: '🚫 Blacklist Automática',
    description: 'Sistema de controle rigoroso com blacklist automática para desligamentos graves. Reeducandos blacklisted não podem ter ficha cadastral ativa e não concorrem a vagas. Validação em tempo real de 108 artigos penais (5 legislações), regime prisional e requisitos de escolaridade. Zero margem para erro humano.',
    chips: ['⚖️ 108 Artigos', '🏛️ Regimes', '🚫 Blacklist'],
  },
  {
    icon: 'solar:chart-bold',
    color: 'warning',
    title: '📊 Gestão Completa + IA',
    description: 'Controle granular de cada vaga individual com histórico completo. Inteligência Artificial para criar ocorrências automaticamente (desligamentos, advertências). Registro de 100% das decisões para treinamento de Machine Learning. Analytics em tempo real com KPIs detalhados de performance e alocação.',
    chips: ['🤖 Inteligência Artificial', '📈 Vagas Individuais', '📊 Analytics'],
  },
];

// ----------------------------------------------------------------------

export function OverviewSection() {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Typography variant="h2" align="center" sx={{ mb: 2 }}>
        Por que o SAGEP?
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Automatize o processo de alocação de reeducandos com inteligência artificial
      </Typography>
      
      <Grid container spacing={3}>
        {FEATURES.map((feature, index) => (
          <Grid key={index} size={{ md: 4, xs: 12 }}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: `${feature.color}.lighter`,
                  color: `${feature.color}.main`,
                }}
              >
                <Iconify icon={feature.icon as any} width={40} />
              </Avatar>
              
              <Typography variant="h4" sx={{ mb: 2 }}>
                {feature.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                {feature.chips.map((chip, idx) => (
                  <Chip key={idx} label={chip} size="small" />
                ))}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

