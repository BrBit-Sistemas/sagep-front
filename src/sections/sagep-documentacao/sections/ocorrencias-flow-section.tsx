import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import TableRow from '@mui/material/TableRow';
import StepLabel from '@mui/material/StepLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FLUXO_CADASTRO_IA = [
  {
    titulo: '1. Tela de Cadastro de Ocorrências',
    descricao: 'Servidor acessa menu "Ocorrências" → "Cadastrar Nova"',
    icon: 'solar:settings-bold',
    cor: 'primary',
  },
  {
    titulo: '2. Opção: IA ou Manual',
    descricao: 'Escolhe entre criar com ajuda da IA ou preencher manualmente',
    icon: 'solar:widget-bold',
    cor: 'info',
  },
  {
    titulo: '3A. Com IA: Descreve Situação',
    descricao: 'Digita texto livre do que precisa',
    exemplo: '"Reeducando faltou 3 dias seguidos sem justificar"',
    icon: 'solar:magic-stick-bold',
    cor: 'warning',
  },
  {
    titulo: '3B. Com IA: Sistema Sugere',
    descricao: 'IA retorna estrutura completa para revisão',
    exemplo: 'Nome, Tipo, Descrição, Gera Blacklist',
    icon: 'solar:stars-bold',
    cor: 'warning',
  },
  {
    titulo: '4. Salva no Banco',
    descricao: 'Ocorrência cadastrada e disponível para USO em todo sistema',
    icon: 'solar:diskette-bold',
    cor: 'success',
  },
];

const FLUXO_USO = [
  {
    contexto: 'Desligamento',
    quando: 'Ao encerrar contrato de trabalho',
    seleciona: 'Ocorrência tipo DESLIGAMENTO',
    exemplo: '"Desligamento - Falta Grave"',
  },
  {
    contexto: 'Remoção de Blacklist',
    quando: 'Ao remover reeducando da blacklist',
    seleciona: 'Ocorrência tipo REMOÇÃO_BLACKLIST',
    exemplo: '"Recurso Administrativo Aprovado"',
  },
  {
    contexto: 'Matching Fora do Top 5',
    quando: 'Ao escolher candidato fora do ranking',
    seleciona: 'Ocorrência tipo JUSTIFICATIVA_MATCHING',
    exemplo: '"Indicação da Unidade Prisional"',
  },
  {
    contexto: 'Suspensão Temporária',
    quando: 'Ao suspender temporariamente o trabalho',
    seleciona: 'Ocorrência tipo SUSPENSÃO',
    exemplo: '"Problemas de Saúde Temporários"',
  },
  {
    contexto: 'Advertência',
    quando: 'Ao registrar advertência disciplinar',
    seleciona: 'Ocorrência tipo ADVERTÊNCIA',
    exemplo: '"Atraso Recorrente - 1ª Advertência"',
  },
];

const TODAS_OCORRENCIAS = [
  {
    categoria: 'DESLIGAMENTO',
    cor: 'error',
    icon: 'solar:close-circle-bold',
    exemplos: [
      { nome: 'Desligamento - Falta Grave', blacklist: true },
      { nome: 'Desligamento - Indisciplina', blacklist: true },
      { nome: 'Desligamento - Baixa Performance', blacklist: true },
      { nome: 'Desligamento - Pedido da Empresa', blacklist: true },
      { nome: 'Desligamento - Pedido do Reeducando', blacklist: false },
      { nome: 'Término de Contrato Natural', blacklist: false },
      { nome: 'Progressão de Regime', blacklist: false },
    ],
  },
  {
    categoria: 'REMOÇÃO_BLACKLIST',
    cor: 'success',
    icon: 'solar:shield-check-bold',
    exemplos: [
      { nome: 'Recurso Administrativo Aprovado', blacklist: false },
      { nome: 'Revisão da Comissão Disciplinar', blacklist: false },
      { nome: 'Mudança Comportamental Comprovada', blacklist: false },
      { nome: 'Decisão Judicial', blacklist: false },
    ],
  },
  {
    categoria: 'JUSTIFICATIVA_MATCHING',
    cor: 'info',
    icon: 'solar:user-check-bold',
    exemplos: [
      { nome: 'Indicação da Unidade Prisional', blacklist: false },
      { nome: 'Experiência Prévia Comprovada', blacklist: false },
      { nome: 'Solicitação da Empresa', blacklist: false },
      { nome: 'Perfil Comportamental Adequado', blacklist: false },
      { nome: 'Proximidade Familiar Excepcional', blacklist: false },
    ],
  },
  {
    categoria: 'SUSPENSÃO',
    cor: 'warning',
    icon: 'solar:pause-circle-bold',
    exemplos: [
      { nome: 'Problemas de Saúde Temporários', blacklist: false },
      { nome: 'Afastamento por Investigação Interna', blacklist: false },
      { nome: 'Suspensão Disciplinar - 15 dias', blacklist: false },
      { nome: 'Licença Médica', blacklist: false },
    ],
  },
  {
    categoria: 'ADVERTÊNCIA',
    cor: 'warning',
    icon: 'solar:danger-triangle-bold',
    exemplos: [
      { nome: '1ª Advertência - Atraso Recorrente', blacklist: false },
      { nome: '2ª Advertência - Postura Inadequada', blacklist: false },
      { nome: '3ª Advertência - Última Chance', blacklist: false },
    ],
  },
  {
    categoria: 'OUTRO',
    cor: 'default',
    icon: 'solar:menu-dots-bold',
    exemplos: [
      { nome: 'Observação Geral', blacklist: false },
      { nome: 'Registro de Reunião', blacklist: false },
      { nome: 'Alteração de Escala', blacklist: false },
    ],
  },
];

// ----------------------------------------------------------------------

export function OcorrenciasFlowSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h3" gutterBottom>
          🤖 Sistema de Ocorrências com Inteligência Artificial
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cadastro centralizado de ocorrências com assistente inteligente. 
          Crie uma vez, use em todo o sistema.
        </Typography>
      </Box>

      {/* Alert Explicativo */}
      <Alert severity="info" icon={<Iconify icon="solar:lightbulb-bold" width={24} {...({} as any)} />}>
        <AlertTitle>📌 Como Funciona</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>1. CADASTRO:</strong> Servidor acessa tela dedicada de &ldquo;Ocorrências&rdquo; 
          e cadastra novas ocorrências (com ou sem Inteligência Artificial)
        </Typography>
        <Typography variant="body2">
          <strong>2. USO:</strong> Nas telas de desligamento, blacklist, matching, etc., 
          servidor <strong>apenas seleciona</strong> ocorrências já cadastradas
        </Typography>
      </Alert>

      {/* Fluxo de CADASTRO */}
      <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
              <Iconify icon="solar:settings-bold" width={32} {...({} as any)} />
            </Avatar>
          }
          title={
            <Typography variant="h5">
              🔧 CADASTRO de Ocorrências (Tela Dedicada)
            </Typography>
          }
          subheader="Onde ocorrências são CRIADAS"
        />
        <CardContent>
          <Stepper orientation="vertical">
            {FLUXO_CADASTRO_IA.map((passo, index) => (
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
                  {passo.exemplo && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="caption">{passo.exemplo}</Typography>
                    </Alert>
                  )}
                </StepLabel>
                <Box sx={{ pb: 3 }} />
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Fluxo de USO */}
      <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
              <Iconify icon="solar:check-circle-bold" width={32} {...({} as any)} />
            </Avatar>
          }
          title={
            <Typography variant="h5">
              ✅ USO de Ocorrências (Telas do Sistema)
            </Typography>
          }
          subheader="Onde ocorrências são SELECIONADAS"
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Contexto</strong></TableCell>
                  <TableCell><strong>Quando Usa</strong></TableCell>
                  <TableCell><strong>Seleciona</strong></TableCell>
                  <TableCell><strong>Exemplo</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FLUXO_USO.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Chip label={item.contexto} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{item.quando}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontWeight={600}>
                        {item.seleciona}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {item.exemplo}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* TODAS as Ocorrências Previstas */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          📋 Todas as Ocorrências Previstas no Sistema
        </Typography>
        <Stack spacing={3}>
          {TODAS_OCORRENCIAS.map((categoria) => (
            <Card
              key={categoria.categoria}
              sx={{
                border: 2,
                borderColor: categoria.cor === 'default' ? 'divider' : `${categoria.cor}.main`,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor:
                        categoria.cor === 'default' ? 'grey.400' : `${categoria.cor}.main`,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Iconify icon={categoria.icon as any} width={32} />
                  </Avatar>
                }
                title={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h5">{categoria.categoria}</Typography>
                    <Chip
                      label={`${categoria.exemplos.length} exemplos`}
                      size="small"
                      color={categoria.cor === 'default' ? undefined : (categoria.cor as any)}
                    />
                  </Stack>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={1.5}>
                  {categoria.exemplos.map((ex, idx) => (
                    <Grid key={idx} size={{ xs: 12, md: 6 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          bgcolor:
                            categoria.cor === 'default'
                              ? 'background.neutral'
                              : alpha((theme.palette as any)[categoria.cor].main, 0.08),
                        }}
                      >
                        <CardContent>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: ex.blacklist ? 'error.main' : 'success.main',
                              }}
                            />
                            <Box flex={1}>
                              <Typography variant="body2" fontWeight={600}>
                                {ex.nome}
                              </Typography>
                            </Box>
                            <Chip
              label={ex.blacklist ? '🚫 Gera Blacklist' : '✅ Não Gera Blacklist'}
              size="small"
              color={ex.blacklist ? 'error' : 'success'}
              sx={{ fontSize: '0.7rem' }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Benefícios da Inteligência Artificial */}
      <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            ✨ Benefícios da Inteligência Artificial no Cadastro
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <Iconify icon="solar:document-text-bold" width={28} {...({} as any)} />
                </Avatar>
                <Typography variant="h6">Padronização</Typography>
                <Typography variant="body2" color="text.secondary">
                  Linguagem consistente e profissional em todos os registros
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <Iconify icon="solar:bolt-bold" width={28} {...({} as any)} />
                </Avatar>
                <Typography variant="h6">Agilidade</Typography>
                <Typography variant="body2" color="text.secondary">
                  Reduz tempo de criação de 5 minutos para 30 segundos
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <Iconify icon="solar:shield-check-bold" width={28} {...({} as any)} />
                </Avatar>
                <Typography variant="h6">Qualidade</Typography>
                <Typography variant="body2" color="text.secondary">
                  Evita erros, ambiguidades e garante informações completas
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alertas Finais */}
      <Stack spacing={2}>
        <Alert severity="success" icon={<Iconify icon="solar:check-circle-bold" width={24} {...({} as any)} />}>
          <AlertTitle>✅ Cadastro Manual Disponível</AlertTitle>
          Servidor pode criar ocorrências manualmente sem usar Inteligência Artificial, 
          preenchendo todos os campos diretamente no formulário.
        </Alert>

        <Alert severity="info">
          <AlertTitle>🔒 CRUD Completo</AlertTitle>
          Ocorrências podem ser criadas, editadas, desativadas (soft delete) e reativadas. 
          Histórico completo preservado para auditoria.
        </Alert>

        <Alert severity="warning">
          <AlertTitle>⚠️ Campo Livre Adicional</AlertTitle>
          Ao <strong>usar</strong> uma ocorrência (ex: em desligamento), 
          servidor pode adicionar detalhes específicos no campo livre complementar.
        </Alert>
      </Stack>
    </Stack>
  );
}

