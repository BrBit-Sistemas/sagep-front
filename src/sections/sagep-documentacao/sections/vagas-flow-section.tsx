import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_VAGA = [
  { status: 'DISPONIVEL', cor: 'success', icon: 'solar:check-circle-bold', desc: 'Livre para matching' },
  { status: 'OCUPADA', cor: 'info', icon: 'solar:user-bold', desc: 'Reeducando alocado' },
  { status: 'INDISPONIBILIZADA', cor: 'warning', icon: 'solar:close-circle-bold', desc: 'Suspensa manualmente' },
  { status: 'SUSPENSA', cor: 'error', icon: 'solar:pause-circle-bold', desc: 'Suspensa por sistema' },
];

const EXEMPLO_VAGAS = [
  { numero: 1, status: 'OCUPADA', reeducando: 'João Silva', desde: '01/01/2025' },
  { numero: 2, status: 'OCUPADA', reeducando: 'Maria Santos', desde: '15/01/2025' },
  { numero: 3, status: 'INDISPONIBILIZADA', reeducando: null, motivo: 'Empresa solicitou' },
  { numero: 4, status: 'DISPONIVEL', reeducando: null, motivo: null },
  { numero: 5, status: 'DISPONIVEL', reeducando: null, motivo: null },
];

// ----------------------------------------------------------------------

export function VagasFlowSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h3" gutterBottom>
          📍 Gestão Granular de Vagas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Controle individual de cada vaga com histórico completo
        </Typography>
      </Box>

      {/* Status Possíveis */}
      <Grid container spacing={2}>
        {STATUS_VAGA.map((item) => (
          <Grid key={item.status} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                bgcolor: alpha((theme.palette as any)[item.cor].main, 0.12),
                border: 2,
                borderColor: `${item.cor}.main`,
              }}
            >
              <CardContent>
                <Stack direction="column" alignItems="center" spacing={1} textAlign="center">
                  <Avatar sx={{ bgcolor: `${item.cor}.main`, width: 56, height: 56 }}>
                    <Iconify icon={item.icon as any} width={32} />
                  </Avatar>
                  <Chip label={item.status} color={item.cor as any} />
                  <Typography variant="caption" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Exemplo Prático */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💡 Exemplo: Convênio com 5 Vagas de Pedreiro
          </Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Vaga #</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Reeducando</strong></TableCell>
                  <TableCell><strong>Desde / Motivo</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {EXEMPLO_VAGAS.map((vaga) => (
                  <TableRow key={vaga.numero}>
                    <TableCell>
                      <Chip label={`Vaga #${vaga.numero}`} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vaga.status}
                        color={
                          STATUS_VAGA.find((s) => s.status === vaga.status)?.cor as any
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{vaga.reeducando || '-'}</TableCell>
                    <TableCell>
                      {vaga.desde && (
                        <Typography variant="caption">📅 {vaga.desde}</Typography>
                      )}
                      {vaga.motivo && (
                        <Typography variant="caption">⚠️ {vaga.motivo}</Typography>
                      )}
                      {!vaga.desde && !vaga.motivo && '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Contador:</strong> Total 5 | Ocupadas 2 | Indisponibilizadas 1 | <strong>Disponíveis 2</strong>
          </Alert>
        </CardContent>
      </Card>

      {/* Ações Possíveis */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            ⚙️ Ações Disponíveis
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Iconify icon="solar:pause-circle-bold" width={24} {...({} as any)} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Indisponibilizar Vaga
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Servidor pode suspender vaga específica a qualquer momento (ex: empresa solicitou redução temporária)
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Iconify icon="solar:restart-bold" width={24} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Reativar Vaga
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vaga INDISPONIBILIZADA pode voltar a DISPONIVEL quando necessário
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Stack spacing={2}>
        <Alert severity="success">
          <AlertTitle>✅ Histórico Preservado</AlertTitle>
          Cada vaga mantém array <code>historico_alocacoes</code> com: 
          quem ocupou, período, motivo de saída, avaliação.
        </Alert>
        
        <Alert severity="info">
          <AlertTitle>📊 Contadores Automáticos</AlertTitle>
          Sistema calcula automaticamente quantas vagas estão disponíveis, ocupadas e indisponibilizadas.
        </Alert>
      </Stack>
    </Stack>
  );
}

