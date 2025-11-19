import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Timeline from '@mui/lab/Timeline';
import Avatar from '@mui/material/Avatar';
import Stepper from '@mui/material/Stepper';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TimelineDot from '@mui/lab/TimelineDot';
import StepLabel from '@mui/material/StepLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import TimelineContent from '@mui/lab/TimelineContent';
import TableContainer from '@mui/material/TableContainer';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FLUXO_CADASTRO = [
  {
    titulo: '1. Cadastro da Empresa',
    descricao: 'Dados básicos da empresa parceira',
    detalhes: [
      'CNPJ, Razão Social, Nome Fantasia',
      'Endereço completo',
      'Contato (telefone, e-mail)',
      'Responsável legal',
    ],
    cor: 'primary',
    icon: 'solar:buildings-bold',
  },
  {
    titulo: '2. Criação do Convênio',
    descricao: 'Termo de parceria com a FUNAP',
    detalhes: [
      'Data início e fim (vigência)',
      'Locais de execução (1 ou mais endereços)',
      'Artigos penais vedados (global)',
      'Quantitativos de vagas por profissão',
    ],
    cor: 'info',
    icon: 'solar:document-text-bold',
  },
  {
    titulo: '3. Definição de Quantitativos',
    descricao: 'Vagas disponibilizadas por profissão (GRANULAR v3.0)',
    detalhes: [
      'Profissão + Quantidade total',
      'Escolaridade mínima exigida',
      '🆕 Regimes permitidos (POR QUANTITATIVO, não global)',
      '🆕 Local de execução (POR QUANTITATIVO, não global)',
      'Estado inicial: CONGELADO ou ATIVO',
    ],
    cor: 'success',
    icon: 'solar:chart-square-bold',
  },
];

const ESTADOS_QUANTITATIVO = [
  {
    estado: 'CONGELADO',
    cor: 'info',
    icon: 'solar:snowflake-bold',
    descricao: 'Vagas reservadas, não aparecem no dashboard',
    quando: 'Cadastro inicial, aguardando liberação gradual',
  },
  {
    estado: 'ATIVO',
    cor: 'success',
    icon: 'solar:check-circle-bold',
    descricao: 'Vagas disponíveis para matching',
    quando: 'Liberadas pelo servidor FUNAP conforme demanda',
  },
  {
    estado: 'SUSPENSO',
    cor: 'warning',
    icon: 'solar:pause-circle-bold',
    descricao: 'Temporariamente indisponível',
    quando: 'Empresa solicitou pausa ou ajuste',
  },
  {
    estado: 'ENCERRADO',
    cor: 'error',
    icon: 'solar:close-circle-bold',
    descricao: 'Finalizado, não gera mais vagas',
    quando: 'Fim do convênio ou cancelamento',
  },
];

const EXEMPLO_LIBERACAO = [
  { etapa: 'Cadastro Inicial', ativas: 0, congeladas: 100, total: 100, data: '01/01/2025' },
  { etapa: 'Primeira Liberação', ativas: 5, congeladas: 95, total: 100, data: '05/01/2025' },
  { etapa: 'Segunda Liberação', ativas: 15, congeladas: 85, total: 100, data: '20/01/2025' },
  { etapa: 'Terceira Liberação', ativas: 30, congeladas: 70, total: 100, data: '10/02/2025' },
  { etapa: 'Liberação Total', ativas: 100, congeladas: 0, total: 100, data: '01/03/2025' },
];

// ----------------------------------------------------------------------

export function EmpresasConveniosFlowSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      {/* Título */}
      <Box>
        <Typography variant="h3" gutterBottom>
          🏢 Empresas & Convênios
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestão completa de empresas parceiras, convênios e liberação gradual de vagas
        </Typography>
      </Box>

      {/* Fluxo de Cadastro */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🔄 Fluxo Completo de Cadastro
          </Typography>
          <Stepper orientation="vertical">
            {FLUXO_CADASTRO.map((passo, index) => (
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

      {/* Estados do Quantitativo */}
      <Box>
        <Typography variant="h5" gutterBottom>
          🎭 Estados do Quantitativo de Vagas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Cada quantitativo tem um estado que controla sua disponibilidade no dashboard
        </Typography>
        <Grid container spacing={2}>
          {ESTADOS_QUANTITATIVO.map((estado) => (
            <Grid key={estado.estado} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  border: 2,
                  borderColor: `${estado.cor}.main`,
                  bgcolor: alpha((theme.palette as any)[estado.cor].main, 0.08),
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
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
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {estado.descricao}
                    </Typography>
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                      <strong>Quando usar:</strong><br />
                      {estado.quando}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Liberação Gradual */}
      <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📈 Liberação Gradual de Vagas (Exemplo Prático)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Convênio cadastrado com <strong>100 vagas de Pedreiro</strong>. 
            Servidor FUNAP libera gradualmente conforme demanda e capacidade de acompanhamento.
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Etapa</strong></TableCell>
                  <TableCell align="center"><strong>Vagas Ativas</strong></TableCell>
                  <TableCell align="center"><strong>Vagas Congeladas</strong></TableCell>
                  <TableCell align="center"><strong>Total</strong></TableCell>
                  <TableCell><strong>Data</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {EXEMPLO_LIBERACAO.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.etapa}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.ativas} color="success" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={row.congeladas} color="info" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={700}>{row.total}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{row.data}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="success" sx={{ mt: 3 }}>
            <AlertTitle>✅ Controle Granular</AlertTitle>
            Servidor FUNAP decide quando liberar mais vagas baseado em:
            capacidade de acompanhamento, desempenho das alocações atuais, demanda da empresa.
          </Alert>
        </CardContent>
      </Card>

      {/* Timeline Visual */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ⏱️ Linha do Tempo (Cenário Real)
          </Typography>
          <Timeline position="right">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <Iconify icon="solar:buildings-bold" width={20} {...({} as any)} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Empresa Cadastrada</Typography>
                <Typography variant="caption" color="text.secondary">
                  01/01/2025 - Construtora ABC Ltda
                </Typography>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="info">
                  <Iconify icon="solar:document-text-bold" width={20} {...({} as any)} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Convênio Criado</Typography>
                <Typography variant="caption" color="text.secondary">
                  02/01/2025 - Vigência: 12 meses | 100 vagas Pedreiro (CONGELADAS)
                </Typography>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success">
                  <Iconify icon="solar:check-circle-bold" width={20} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">Primeira Liberação: 5 vagas</Typography>
                <Typography variant="caption" color="text.secondary">
                  05/01/2025 - Quantitativo mudou para ATIVO (5 vagas)
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
                <Typography variant="subtitle2">Dashboard atualizado ✅</Typography>
                <Typography variant="caption" color="text.secondary">
                  05/01/2025 - 5 vagas disponíveis para matching
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>

      {/* MUDANÇA v3.0: Regimes e Locais Granulares */}
      <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08), border: '2px solid', borderColor: 'warning.main' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
              <Iconify icon="solar:lightbulb-bolt-bold" width={32} {...({} as any)} />
            </Avatar>
            <Box>
              <Chip label="NOVIDADE v3.0" color="warning" sx={{ mb: 0.5 }} />
              <Typography variant="h5">
                🆕 Regimes e Locais Granulares
              </Typography>
            </Box>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            <strong>ANTES (v2.0):</strong> Regimes e Locais eram GLOBAIS no convênio (todas vagas iguais).
            <br />
            <strong>AGORA (v3.0):</strong> Regimes e Locais são POR QUANTITATIVO (cada profissão diferente).
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
                <CardContent>
                  <Chip label="❌ ANTES (v2.0)" color="error" sx={{ mb: 2 }} />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 1 }}>
                    EmpresaConvenio &#123;
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 2, mb: 1 }}>
                    regimes_permitidos: [1,2,3], // GLOBAL
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 2, mb: 1 }}>
                    locais_execucao: [...], // GLOBAL
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 2, mb: 1 }}>
                    quantitativos: [&#123;profissao, qtd&#125;]
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    &#125;
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
                <CardContent>
                  <Chip label="✅ AGORA (v3.0)" color="success" sx={{ mb: 2 }} />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 1 }}>
                    EmpresaConvenio &#123;
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 2, mb: 1 }}>
                    artigos_vedados: [...], // GLOBAL
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 2, mb: 1 }}>
                    quantitativos: [&#123;
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 4, mb: 1 }}>
                    profissao, qtd,
                  </Typography>
                  <Typography variant="caption" display="block" color="success.dark" sx={{ fontFamily: 'monospace', ml: 4, mb: 1, fontWeight: 700 }}>
                    regimes_permitidos: [1,2], // 🆕
                  </Typography>
                  <Typography variant="caption" display="block" color="success.dark" sx={{ fontFamily: 'monospace', ml: 4, mb: 1, fontWeight: 700 }}>
                    local_execucao_id: uuid // 🆕
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace', ml: 2, mb: 1 }}>
                    &#125;]
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    &#125;
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            💡 Exemplo Prático: 100 Vagas de Pedreiro
          </Typography>
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Typography variant="h6">50</Typography>
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Quantitativo #1: 50 Vagas em Taguatinga
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      📍 Local: Setor C Norte, Taguatinga/DF
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      🏛️ Regimes: [3, 4, 5] (Semiaberto, Regime Aberto, Liberdade Condicional)
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      🎓 Escolaridade: Fundamental Completo
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <Typography variant="h6">50</Typography>
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Quantitativo #2: 50 Vagas em Samambaia
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      📍 Local: QR 301, Samambaia/DF
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      🏛️ Regimes: [4, 5] (Regime Aberto, Liberdade Condicional)
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      🎓 Escolaridade: Médio Completo
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Alert severity="success" sx={{ mt: 3 }}>
            <strong>✅ Vantagem:</strong> Mesma profissão (Pedreiro), mas com requisitos diferentes! 
            Flexibilidade total para a empresa conforme necessidades de cada obra/local.
          </Alert>
        </CardContent>
      </Card>

      {/* Alertas Importantes */}
      <Stack spacing={2}>
        <Alert severity="error" icon={<Iconify icon="solar:shield-cross-bold" width={24} {...({} as any)} />}>
          <AlertTitle>🚫 Artigos Vedados (GLOBAL - Não muda)</AlertTitle>
          Artigos penais vedados permanecem <strong>no nível do convênio</strong>, 
          aplicando-se a TODAS as vagas, independente da profissão ou local.
        </Alert>

        <Alert severity="warning" icon={<Iconify icon="solar:danger-bold" width={24} {...({} as any)} />}>
          <AlertTitle>⚠️ Dashboard de Vagas</AlertTitle>
          O dashboard <strong>APENAS exibe quantitativos com estado ATIVO</strong>. 
          Quantitativos CONGELADOS não aparecem até serem liberados manualmente pelo servidor FUNAP.
        </Alert>
        
        <Alert severity="info">
          <AlertTitle>📊 Múltiplos Quantitativos da Mesma Profissão</AlertTitle>
          É possível ter vários quantitativos da mesma profissão com 
          <strong> locais e regimes diferentes</strong>! 
          Ex: 50 Pedreiros em Taguatinga (Semiaberto) + 50 Pedreiros em Samambaia (Aberto).
        </Alert>

        <Alert severity="success">
          <AlertTitle>🎯 Estrutura Hierárquica</AlertTitle>
          <strong>Empresa</strong> → <strong>Convênio</strong> (artigos vedados globais) → 
          <strong>Quantitativos</strong> (regimes + local por profissão) → <strong>Vagas Individuais</strong> (status granular)
        </Alert>
      </Stack>
    </Stack>
  );
}

