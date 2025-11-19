import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TIPOS_DESLIGAMENTO = [
  {
    tipo: 'DESLIGAMENTO_COMPORTAMENTO',
    gera_blacklist: true,
    cor: 'error',
    icon: 'solar:shield-warning-bold',
    exemplos: ['Falta grave', 'Indisciplina', 'Desrespeito'],
  },
  {
    tipo: 'DESLIGAMENTO_PERFORMANCE',
    gera_blacklist: true,
    cor: 'error',
    icon: 'solar:chart-square-bold',
    exemplos: ['Baixa produtividade', 'Não cumpre metas', 'Desempenho inadequado'],
  },
  {
    tipo: 'DESLIGAMENTO_PEDIDO_EMPRESA',
    gera_blacklist: true,
    cor: 'error',
    icon: 'solar:buildings-bold',
    exemplos: ['Empresa não quer renovar', 'Incompatibilidade'],
  },
  {
    tipo: 'DESLIGAMENTO_PEDIDO_REEDUCANDO',
    gera_blacklist: false,
    cor: 'warning',
    icon: 'solar:hand-shake-bold',
    exemplos: ['Reeducando pede saída', 'Motivos pessoais'],
  },
  {
    tipo: 'FIM_CONTRATO',
    gera_blacklist: false,
    cor: 'success',
    icon: 'solar:calendar-mark-bold',
    exemplos: ['Término natural do prazo', 'Contrato encerrado normalmente'],
  },
  {
    tipo: 'PROGRESSAO_REGIME',
    gera_blacklist: false,
    cor: 'info',
    icon: 'solar:medal-star-bold',
    exemplos: ['Progressão para regime menos rígido', 'Mudança de unidade'],
  },
];

// ----------------------------------------------------------------------

export function BlacklistFlowSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h3" gutterBottom>
          🚫 Sistema de Blacklist Automática
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Controle rigoroso de reeducandos com histórico de desligamentos graves
        </Typography>
      </Box>

      {/* Fluxo */}
      <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🔄 Como Funciona o Blacklist
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <Typography variant="h6">1</Typography>
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Desligamento com Motivo Grave
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servidor registra desligamento com ocorrência que <strong>gera_blacklist: true</strong>
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <Typography variant="h6">2</Typography>
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Detento Marcado como Blacklisted
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Campo <code>is_blacklisted</code> = <strong>true</strong> + motivo + data + responsável
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <Typography variant="h6">3</Typography>
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Ficha Cadastral Atual Inativada Automaticamente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status muda para <strong>INATIVA</strong> → não concorre mais a vagas
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <Typography variant="h6">4</Typography>
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Sistema Impede Nova Ficha Cadastral
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ao tentar criar nova Ficha Cadastral, validação verifica <code>is_blacklisted</code> e <strong>BLOQUEIA</strong>
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <Typography variant="h6">5</Typography>
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    🆕 Remoção da Blacklist (Manual)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servidor pode <strong>remover da blacklist</strong> informando uma 
                    <strong> ocorrência com motivo/justificativa</strong> da decisão administrativa
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Tipos de Desligamento */}
      <Box>
        <Typography variant="h5" gutterBottom>
          📋 Tipos de Desligamento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Apenas desligamentos graves geram blacklist automática
        </Typography>
        <Grid container spacing={2}>
          {TIPOS_DESLIGAMENTO.map((tipo) => (
            <Grid key={tipo.tipo} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  border: 2,
                  borderColor: tipo.gera_blacklist ? 'error.main' : 'success.main',
                  bgcolor: alpha((theme.palette as any)[tipo.cor].main, 0.08),
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${tipo.cor}.main`, color: 'white' }}>
                      <Iconify icon={tipo.icon as any} width={24} />
                    </Avatar>
                    <Box>
                      <Chip
                        label={tipo.gera_blacklist ? '🚫 GERA BLACKLIST' : '✅ NÃO GERA'}
                        color={tipo.gera_blacklist ? 'error' : 'success'}
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="caption" display="block" fontWeight={600}>
                        {tipo.tipo}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    <strong>Exemplos:</strong>
                  </Typography>
                  <Stack spacing={0.5}>
                    {tipo.exemplos.map((ex, idx) => (
                      <Typography key={idx} variant="caption" color="text.secondary">
                        • {ex}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Alertas */}
      <Stack spacing={2}>
        <Alert severity="warning" icon={<Iconify icon="solar:shield-check-bold" width={24} {...({} as any)} />}>
          <AlertTitle>⚠️ Remoção da Blacklist (Processo Manual)</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Servidor FUNAP pode remover reeducando da blacklist através do sistema, 
            <strong> desde que informe uma ocorrência com justificativa</strong> da decisão administrativa.
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
            📝 Exemplo: &ldquo;Reeducando apresentou recurso administrativo, demonstrou mudança de comportamento 
            e foi aprovado pela comissão disciplinar em 10/11/2025&rdquo;
          </Typography>
        </Alert>

        <Alert severity="error" icon={<Iconify icon="solar:danger-bold" width={24} />}>
          <AlertTitle>🚨 Bloqueio Automático de Nova Ficha Cadastral</AlertTitle>
          Enquanto <code>is_blacklisted = true</code>, o sistema <strong>BLOQUEIA</strong> a criação 
          de nova Ficha Cadastral. Após remoção da blacklist, reeducando volta a poder criar Ficha Cadastral normalmente.
        </Alert>
        
        <Alert severity="info">
          <AlertTitle>📊 Histórico Completo (Auditoria)</AlertTitle>
          Todas as inclusões <strong>E remoções</strong> da blacklist ficam registradas na tabela 
          <code>blacklist_historico</code> com motivo, data, responsável e ocorrência relacionada.
        </Alert>

        <Alert severity="success">
          <AlertTitle>✅ Sem Ficha Cadastral Ativa = Não Concorre</AlertTitle>
          Blacklist <strong>não precisa ser verificado no matching</strong> pois reeducandos 
          sem Ficha Cadastral ativa já estão automaticamente fora da fila.
        </Alert>
      </Stack>
    </Stack>
  );
}

