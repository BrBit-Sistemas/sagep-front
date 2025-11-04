import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const USE_CASES = [
  {
    icon: 'solar:buildings-bold',
    color: 'primary',
    title: 'Construtora - 250 vagas',
    subtitle: 'Construção Civil - Múltiplas Profissões',
    situation: 'Empresa oferece 250 vagas (100 pedreiros, 80 serventes, 70 auxiliares) distribuídas em 5 locais diferentes no DF. Sistema possui 180 candidatos elegíveis.',
    solution: 'SAGEP analisa automaticamente 180 perfis, aplica critérios eliminatórios (artigos vedados, regime), calcula distância para cada local e ranqueia por tempo de fila. Processo: 8 minutos vs 6 horas manual.',
    chips: ['93% mais rápido', '100% compliance'],
  },
  {
    icon: 'solar:shield-warning-bold',
    color: 'error',
    title: 'Banco - Artigos Vedados',
    subtitle: 'Segurança Financeira',
    situation: 'Instituição financeira oferece 35 vagas administrativas mas veda crimes patrimoniais (CP:155-furto, CP:157-roubo, CP:171-estelionato, CP:312-apropriação). 120 candidatos na fila.',
    solution: 'Sistema elimina automaticamente 48 candidatos (40%) com artigos vedados. Restam 72 elegíveis com perfil seguro. Risco zero de alocação inadequada. Auditoria automática garantida.',
    chips: ['Zero risco', '40% filtrados'],
  },
];

// ----------------------------------------------------------------------

export function UseCasesSection() {
  return (
    <Box sx={{ bgcolor: 'background.neutral', py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{ mb: 2 }}>
          💼 Casos de Uso Reais
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Veja como o SAGEP resolve problemas reais da FUNAP
        </Typography>
        
        <Grid container spacing={3}>
          {USE_CASES.map((useCase, index) => (
            <Grid key={index} size={{ md: 6, xs: 12 }}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: `${useCase.color}.lighter`, color: `${useCase.color}.main`, mr: 2 }}>
                    <Iconify icon={useCase.icon as any} width={28} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>{useCase.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{useCase.subtitle}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>📋 Situação:</Typography>
                    <Typography variant="body2" color="text.secondary">{useCase.situation}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>✅ Solução SAGEP:</Typography>
                    <Alert severity="success"><Typography variant="body2">{useCase.solution}</Typography></Alert>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {useCase.chips.map((chip, idx) => (
                      <Chip key={idx} label={chip} color="success" size="small" />
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

