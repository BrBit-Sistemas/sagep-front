import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Avatar from '@mui/material/Avatar';
import Stepper from '@mui/material/Stepper';
import Divider from '@mui/material/Divider';
import TimelineDot from '@mui/lab/TimelineDot';
import StepLabel from '@mui/material/StepLabel';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ESTADOS_FC = [
  {
    estado: 'AGUARDANDO_VALIDACAO',
    cor: 'warning',
    icon: 'solar:hourglass-bold',
    titulo: 'Aguardando Validação',
    descricao: 'FC recém-criada, aguardando análise do servidor FUNAP',
    proximosEstados: ['EM_VALIDACAO', 'VALIDADO', 'REQUER_CORRECAO', 'REJEITADA'],
  },
  {
    estado: 'EM_VALIDACAO',
    cor: 'info',
    icon: 'solar:document-medicine-bold',
    titulo: 'Em Validação',
    descricao: 'Servidor está analisando a Ficha Cadastral (operacional/transitório)',
    proximosEstados: ['VALIDADO', 'REQUER_CORRECAO', 'REJEITADA'],
  },
  {
    estado: 'VALIDADO',
    cor: 'success',
    icon: 'solar:check-circle-bold',
    titulo: 'Validado',
    descricao: 'FC aprovada, reeducando entra na fila (FILA_DISPONIVEL)',
    proximosEstados: ['INATIVA (se blacklist ou progressão)'],
  },
  {
    estado: 'REQUER_CORRECAO',
    cor: 'error',
    icon: 'solar:pen-bold',
    titulo: 'Requer Correção',
    descricao: 'FC precisa ser corrigida pelo reeducando/familiar',
    proximosEstados: ['AGUARDANDO_VALIDACAO (após correção)'],
  },
  {
    estado: 'REJEITADA',
    cor: 'error',
    icon: 'solar:close-circle-bold',
    titulo: 'Rejeitada',
    descricao: 'FC não aprovada, não pode concorrer a vagas',
    proximosEstados: ['N/A (estado final)'],
  },
  {
    estado: 'INATIVA',
    cor: 'info',
    icon: 'solar:archive-down-bold',
    titulo: 'Inativa',
    descricao: 'FC desativada (blacklist, progressão de regime, alocado)',
    proximosEstados: ['N/A (estado final)'],
  },
];

const PROCESSO_COMPLETO = [
  {
    titulo: '1. Preenchimento',
    descricao: 'Reeducando ou familiar preenche formulário completo',
    detalhes: [
      'Dados pessoais + Endereço (CEP obrigatório)',
      'Profissões (até 2)',
      'Escolaridade',
      'Artigos penais (mínimo 1)',
      'Declaração de veracidade',
    ],
    cor: 'primary',
    icon: 'solar:document-add-bold',
  },
  {
    titulo: '2. Validação FUNAP',
    descricao: 'Servidor analisa e valida informações',
    detalhes: [
      'Verifica artigos penais corretos',
      'Confirma regime prisional',
      'Valida documentação',
      'Aprova ou solicita correção',
    ],
    cor: 'info',
    icon: 'solar:user-check-bold',
  },
  {
    titulo: '3. Entrada na Fila',
    descricao: 'Se validado, entra na fila de espera (FIFO)',
    detalhes: [
      'Posição calculada por data_validacao',
      'Aguarda matching com vagas',
      'Pode ser inativada se blacklist',
    ],
    cor: 'success',
    icon: 'solar:list-check-bold',
  },
];

// ----------------------------------------------------------------------

export function FichaCadastralFlowSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      {/* Título da Seção */}
      <Box>
        <Typography variant="h3" gutterBottom>
          📋 Ciclo de Vida da Ficha Cadastral
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Processo completo desde o preenchimento até a entrada na fila ou inativação
        </Typography>
      </Box>

      {/* Processo Passo a Passo */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🔄 Processo Completo (Visual)
          </Typography>
          <Stepper orientation="vertical" sx={{ mt: 3 }}>
            {PROCESSO_COMPLETO.map((passo, index) => (
              <Step key={index} active completed={false}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: alpha((theme.palette as any)[passo.cor].main, 0.16),
                        color: `${passo.cor}.main`,
                      }}
                    >
                      <Iconify icon={passo.icon as any} width={24} />
                    </Avatar>
                  )}
                >
                  <Typography variant="h6">{passo.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {passo.descricao}
                  </Typography>
                </StepLabel>
                <Box sx={{ ml: 7, mt: 1, mb: 3 }}>
                  <Stack spacing={0.5}>
                    {passo.detalhes.map((detalhe, idx) => (
                      <Stack key={idx} direction="row" spacing={1} alignItems="center">
                        <Iconify icon="solar:check-circle-bold" width={16} color="success.main" />
                        <Typography variant="caption" color="text.secondary">
                          {detalhe}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Estados Possíveis */}
      <Box>
        <Typography variant="h5" gutterBottom>
          🎭 Estados Possíveis da FC
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Todos os estados que uma Ficha Cadastral pode assumir durante seu ciclo de vida
        </Typography>
        <Grid container spacing={2}>
          {ESTADOS_FC.map((estado) => (
            <Grid key={estado.estado} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  border: 2,
                  borderColor: `${estado.cor}.main`,
                  bgcolor: alpha((theme.palette as any)[estado.cor].main, 0.08),
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${estado.cor}.main`,
                        color: 'white',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Iconify icon={estado.icon as any} width={28} />
                    </Avatar>
                    <Box>
                      <Chip label={estado.estado} color={estado.cor as any} size="small" sx={{ mb: 0.5 }} />
                      <Typography variant="subtitle2">{estado.titulo}</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {estado.descricao}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                    Próximos estados:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {estado.proximosEstados.join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Timeline Visual */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ⏱️ Linha do Tempo (Exemplo Real)
          </Typography>
          <Timeline position="right">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <Iconify icon="solar:document-add-bold" width={20} {...({} as any)} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">FC Criada</Typography>
                <Typography variant="caption" color="text.secondary">
                  01/11/2025 10:30 - Status: AGUARDANDO_VALIDACAO
                </Typography>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="info">
                  <Iconify icon="solar:user-check-bold" width={20} {...({} as any)} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Servidor Iniciou Análise</Typography>
                <Typography variant="caption" color="text.secondary">
                  01/11/2025 14:15 - Status: EM_VALIDACAO
                </Typography>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success">
                  <Iconify icon="solar:check-circle-bold" width={20} />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">FC Validada ✅</Typography>
                <Typography variant="caption" color="text.secondary">
                  01/11/2025 14:45 - Status: VALIDADO → Entrou na fila (Posição #47)
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>

      {/* Alertas Importantes */}
      <Stack spacing={2}>
        <Alert severity="error" icon={<Iconify icon="solar:shield-warning-bold" width={24} {...({} as any)} />}>
          <AlertTitle>⚠️ Blacklist</AlertTitle>
          Se o reeducando for <strong>blacklisted</strong>, sua Ficha Cadastral atual é <strong>INATIVADA automaticamente</strong>.
          Ele não pode criar nova Ficha Cadastral enquanto estiver na blacklist.
        </Alert>
        
        <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold" width={24} />}>
          <AlertTitle>📌 Apenas 1 Ficha Cadastral Ativa</AlertTitle>
          Um reeducando só pode ter <strong>1 Ficha Cadastral ativa</strong> por vez. 
          Se mudar de regime ou for alocado, a Ficha Cadastral anterior é inativada.
        </Alert>

        <Alert severity="success" icon={<Iconify icon="solar:clock-circle-bold" width={24} />}>
          <AlertTitle>⏰ FIFO Rigoroso</AlertTitle>
          A posição na fila é calculada pela <strong>data_validacao</strong>. 
          Quem foi validado primeiro tem prioridade absoluta (70 pontos no matching).
        </Alert>
      </Stack>
    </Stack>
  );
}

