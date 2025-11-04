import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function MatchingDemoSection() {
  return (
    <Container id="demo" maxWidth="lg" sx={{ py: 10 }}>
      <Typography variant="h2" align="center" sx={{ mb: 2 }}>
        🎯 Motor de Matching Inteligente
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Veja como o algoritmo calcula a compatibilidade em tempo real
      </Typography>
      
      <Grid container spacing={4}>
        {/* Vaga */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>V</Avatar>}
              title="Vaga Disponível"
              subheader="Empresa ABC"
            />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Profissão</Typography>
                  <Typography variant="h6">Pedreiro</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Local</Typography>
                  <Typography>Taguatinga - DF</Typography>
                </Box>
                <Chip label="50 vagas" color="success" />
                <Divider />
                <Stack spacing={1}>
                  <Chip label="✅ Regime: Semiaberto/Aberto" size="small" variant="outlined" />
                  <Chip label="✅ Escolaridade: Fund. II" size="small" variant="outlined" />
                  <Chip label="❌ Artigos vedados: 157, 121" size="small" variant="outlined" color="error" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Algoritmo */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ height: '100%', bgcolor: 'primary.lighter' }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Iconify icon="solar:settings-bold" width={80} sx={{ color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Algoritmo de Matching</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Analisando 23 candidatos...
              </Typography>
              <Stack spacing={2}>
                {[
                  { label: '⏱️ Tempo na fila (50 pts)', value: 100 },
                  { label: '📍 Distância (30 pts)', value: 90 },
                  { label: '🎓 Escolaridade (10 pts)', value: 40 },
                  { label: '💼 Experiência (10 pts)', value: 85 },
                ].map((item, idx) => (
                  <Box key={idx}>
                    <Typography variant="caption">{item.label}</Typography>
                    <LinearProgress variant="determinate" value={item.value} sx={{ height: 8, borderRadius: 1 }} />
                  </Box>
                ))}
              </Stack>
              <Button variant="contained" fullWidth sx={{ mt: 4 }}>Calcular Matches</Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Top 3 */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Stack spacing={2}>
            {[
              { pos: '1º', name: 'João Silva', time: '180 dias', dist: '2.5km', score: 88, color: 'success' },
              { pos: '2º', name: 'Maria Santos', time: '150 dias', dist: '5km', score: 72, color: 'warning' },
              { pos: '3º', name: 'Carlos Souza', time: '90 dias', dist: '8km', score: 55, color: 'info' },
            ].map((candidate, idx) => (
              <Card key={idx} sx={{ borderLeft: 4, borderColor: `${candidate.color}.main` }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: `${candidate.color}.main` }}>{candidate.pos}</Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1">{candidate.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {candidate.time} • {candidate.dist}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h4" color={`${candidate.color}.main`}>{candidate.score}%</Typography>
                      <Typography variant="caption">Match</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

