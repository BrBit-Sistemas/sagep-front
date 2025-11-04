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
    title: '🎯 Matching Inteligente',
    description: 'Algoritmo baseado em 4 critérios ponderados: Tempo de espera (50%), proximidade geográfica (30%), qualificação educacional (10%) e experiência profissional (10%). Reduz tempo de alocação de 2 horas para 5 minutos (96% mais rápido). Score de compatibilidade 0-100% com ranking automático.',
    chips: ['⏱️ FIFO Rigoroso', '📍 CEP Inteligente', '🎓 Qualificação'],
  },
  {
    icon: 'solar:check-circle-bold',
    color: 'success',
    title: '✅ Compliance Automático',
    description: 'Validação em tempo real de 108 artigos penais (5 legislações), regime prisional compatível, requisitos de escolaridade e profissão. Filtros eliminatórios impedem alocações inadequadas. Zero risco de erro humano em verificações críticas de segurança e compliance.',
    chips: ['⚖️ 108 Artigos', '🏛️ Regimes', '🔒 Segurança'],
  },
  {
    icon: 'solar:chart-bold',
    color: 'warning',
    title: '📊 Analytics + IA Evolutiva',
    description: 'Registro de 100% das decisões para treinamento de modelo de Machine Learning. Análise de padrões de sucesso: taxa de finalização de contratos, avaliações de empresas, tempo médio de trabalho. IA aprende e ajusta pesos do algoritmo automaticamente após 6 meses de operação.',
    chips: ['🤖 ML Adaptativo', '📈 KPIs em Tempo Real'],
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

