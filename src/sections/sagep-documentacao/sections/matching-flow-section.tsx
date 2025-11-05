import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const CRITERIOS_ELIMINATORIOS = [
  {
    titulo: '🎯 Profissão',
    descricao: 'Ficha Cadastral deve ter profissão_01 OU profissao_02 igual à vaga',
    exemplo: 'Vaga: Pedreiro → Ficha Cadastral precisa ter "Pedreiro" em profissão_01 ou profissão_02',
    cor: 'primary',
  },
  {
    titulo: '⚖️ Artigos Vedados',
    descricao: 'Ficha Cadastral NÃO pode ter nenhum artigo vedado pelo convênio',
    exemplo: 'Convênio veda "CP:157" (Roubo) → Ficha Cadastral com CP:157 é ELIMINADA',
    cor: 'error',
  },
  {
    titulo: '🏛️ Regime Prisional',
    descricao: 'Ficha Cadastral.regime deve estar nos regimes permitidos da vaga',
    exemplo: 'Vaga permite Semiaberto/Aberto → Ficha Cadastral em Fechado é ELIMINADA',
    cor: 'warning',
  },
  {
    titulo: '🎓 Escolaridade Mínima',
    descricao: 'Ficha Cadastral.escolaridade >= vaga.escolaridade_minima',
    exemplo: 'Vaga exige Médio Completo → Ficha Cadastral com Fundamental é ELIMINADA',
    cor: 'info',
  },
];

const CRITERIOS_CLASSIFICATORIOS = [
  {
    titulo: '🕐 Tempo na Fila (FIFO)',
    peso: 70,
    cor: 'primary',
    icon: 'solar:clock-circle-bold',
    descricao: 'Prioridade ABSOLUTA',
    calculo: 'Quem está há mais tempo recebe 70 pts. Demais proporcionalmente.',
    exemplo: 'João: 180 dias = 70 pts | Maria: 90 dias = 35 pts',
  },
  {
    titulo: '📍 Proximidade (CEP)',
    peso: 30,
    cor: 'success',
    icon: 'solar:map-point-bold',
    descricao: 'Distância geográfica',
    calculo: 'Mais próximo = 30 pts. Demais inversamente proporcionais.',
    exemplo: 'Pedro: 2km = 30 pts | Ana: 20km = 3 pts',
  },
];

const FLUXO_MATCHING = [
  {
    passo: '1. Vaga Disponível',
    descricao: 'Sistema detecta vaga DISPONIVEL para profissão X',
    icon: 'solar:briefcase-bold',
    cor: 'info',
  },
  {
    passo: '2. Busca Fichas Cadastrais Ativas',
    descricao: 'Busca todas Fichas Cadastrais com status VALIDADO e profissão compatível',
    icon: 'solar:users-group-rounded-bold',
    cor: 'primary',
  },
  {
    passo: '3. Filtros Eliminatórios',
    descricao: 'Remove Fichas Cadastrais incompatíveis (artigos, regime, escolaridade)',
    icon: 'solar:filter-bold',
    cor: 'warning',
  },
  {
    passo: '4. Calcula Scores',
    descricao: 'Para cada Ficha Cadastral restante: Tempo (70) + Distância (30) = 0-100%',
    icon: 'solar:calculator-bold',
    cor: 'success',
  },
  {
    passo: '5. Ranking Top 5',
    descricao: 'Ordena por score e apresenta Top 5 ao servidor FUNAP',
    icon: 'solar:ranking-bold',
    cor: 'primary',
  },
  {
    passo: '6. Decisão',
    descricao: 'Servidor escolhe Top 5 OU busca manual (c/ justificativa)',
    icon: 'solar:user-check-bold',
    cor: 'success',
  },
];

// ----------------------------------------------------------------------

export function MatchingFlowSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      {/* Título ÉPICO */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
              boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.5)}`,
            }}
          >
            <Iconify icon="solar:rocket-2-bold" width={48} {...({} as any)} />
          </Avatar>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ mb: 0.5 }}>
              🤖 Matching Inteligente + Inteligência Artificial
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Motor de recomendação com Machine Learning que evolui a cada decisão
            </Typography>
          </Box>
        </Stack>
        
        <Alert
          severity="success"
          icon={<Iconify icon="solar:stars-bold" width={24} {...({} as any)} />}
          sx={{ mb: 3, mt: 7 }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>🚀 Evolução Contínua com Machine Learning</AlertTitle>
          <Typography variant="body2">
            Nosso sistema aprende com <strong>TODAS as decisões humanas</strong>. 
            Quando servidor escolhe candidato fora do Top 5, registramos o motivo e 
            <strong> o Machine Learning ajusta seus pesos futuros</strong> para melhorar as recomendações. 
            Sistema fica mais inteligente a cada alocação! 🧠✨
          </Typography>
        </Alert>
      </Box>

      {/* Fluxo Completo */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🔄 Fluxo Completo do Matching
          </Typography>
          <Grid container spacing={2}>
            {FLUXO_MATCHING.map((etapa, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: alpha((theme.palette as any)[etapa.cor].main, 0.08),
                    border: '2px solid',
                    borderColor: `${etapa.cor}.main`,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: `${etapa.cor}.main`,
                          color: 'white',
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Iconify icon={etapa.icon as any} width={32} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {etapa.passo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {etapa.descricao}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Critérios Eliminatórios */}
      <Box>
        <Typography variant="h5" gutterBottom>
          🚫 Critérios Eliminatórios
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Se Ficha Cadastral não atender qualquer um desses, é <strong>ELIMINADA</strong> automaticamente
        </Typography>
        <Stack spacing={2}>
          {CRITERIOS_ELIMINATORIOS.map((criterio, index) => (
            <Alert key={index} severity={criterio.cor as any} sx={{ alignItems: 'flex-start' }}>
              <AlertTitle sx={{ fontWeight: 700 }}>{criterio.titulo}</AlertTitle>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Regra:</strong> {criterio.descricao}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <strong>Exemplo:</strong> {criterio.exemplo}
              </Typography>
            </Alert>
          ))}
        </Stack>
      </Box>

      {/* Critérios Classificatórios */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            ⭐ Critérios Classificatórios (Score 0-100%)
          </Typography>
          <Grid container spacing={3}>
            {CRITERIOS_CLASSIFICATORIOS.map((criterio) => (
              <Grid key={criterio.titulo} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: alpha((theme.palette as any)[criterio.cor].main, 0.08),
                    border: '2px dashed',
                    borderColor: `${criterio.cor}.main`,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${criterio.cor}.main`,
                          color: 'white',
                          width: 64,
                          height: 64,
                        }}
                      >
                        <Iconify icon={criterio.icon as any} width={36} />
                      </Avatar>
                      <Box>
                        <Chip
                          label={`${criterio.peso} pontos`}
                          color={criterio.cor as any}
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        />
                        <Typography variant="h6">{criterio.titulo}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {criterio.descricao}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Cálculo:</strong> {criterio.calculo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Exemplo:</strong> {criterio.exemplo}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(criterio.peso / 70) * 100}
                        color={criterio.cor as any}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Exemplo Prático */}
      <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💡 Exemplo Prático Completo
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Chip label="Vaga Disponível" color="info" size="small" sx={{ mb: 1 }} />
              <Typography variant="body2">
                • Profissão: <strong>Pedreiro</strong><br />
                • Local: Taguatinga<br />
                • Escolaridade mínima: Fundamental Completo<br />
                • Regimes: Semiaberto, Aberto<br />
                • Artigos vedados: CP:157, CP:171
              </Typography>
            </Box>
            
            <Divider />
            
            <Box>
              <Chip label="Candidatos Após Filtros" color="primary" size="small" sx={{ mb: 1 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>👤 João Silva</Typography>
                      <Typography variant="caption" display="block">Tempo: 180 dias = <strong>70 pts</strong></Typography>
                      <Typography variant="caption" display="block">Distância: 2km = <strong>30 pts</strong></Typography>
                      <Chip label="TOTAL: 100%" color="success" size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>👤 Maria Santos</Typography>
                      <Typography variant="caption" display="block">Tempo: 120 dias = <strong>46.7 pts</strong></Typography>
                      <Typography variant="caption" display="block">Distância: 8km = <strong>7.5 pts</strong></Typography>
                      <Chip label="TOTAL: 54.2%" color="warning" size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>👤 Pedro Costa</Typography>
                      <Typography variant="caption" display="block">Tempo: 90 dias = <strong>35 pts</strong></Typography>
                      <Typography variant="caption" display="block">Distância: 12km = <strong>5 pts</strong></Typography>
                      <Chip label="TOTAL: 40%" color="error" size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            
            <Alert severity="success" icon={<Iconify icon="solar:cup-star-bold" width={24} />}>
              <strong>🏆 João Silva é o Top 1!</strong> Servidor recebe recomendação com João em 1º lugar.
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* SEÇÃO Machine Learning - FUTURO */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.success.main, 0.08)})`,
          border: '3px solid',
          borderColor: 'primary.main',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: 20,
            bgcolor: 'warning.main',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: 3,
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          🚀 FASE 7 - ROADMAP
        </Box>
        <CardContent sx={{ pt: 5 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                boxShadow: `0 0 40px ${alpha(theme.palette.warning.main, 0.6)}`,
              }}
            >
              <Iconify icon="solar:cpu-bolt-bold" width={40} {...({} as any)} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ mb: 0.5 }}>
                🧠 Machine Learning: O Cérebro que Evolui
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Como o sistema aprende e melhora continuamente
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            {/* Coleta de Dados */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: alpha(theme.palette.info.main, 0.08),
                  border: '2px solid',
                  borderColor: 'info.main',
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                      <Iconify icon="solar:database-bold" width={32} {...({} as any)} />
                    </Avatar>
                    <Typography variant="h6">📊 1. Coleta de Dados</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>O que registramos:</strong>
                    </Typography>
                    <Stack spacing={1}>
                      <Chip
                        label="Score do Top 1 vs Candidato Escolhido"
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                      <Chip
                        label="Motivo da escolha (ocorrência)"
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                      <Chip
                        label="Perfil do candidato escolhido"
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                      <Chip
                        label="Características da vaga"
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                      <Chip
                        label="Tempo de permanência no trabalho"
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Aprendizado */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  border: '2px solid',
                  borderColor: 'success.main',
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                      <Iconify icon="solar:graph-new-up-bold" width={32} {...({} as any)} />
                    </Avatar>
                    <Typography variant="h6">🎓 2. Aprendizado Contínuo</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>O que o Machine Learning identifica:</strong>
                    </Typography>
                    <Stack spacing={1}>
                      <Chip
                        label='Padrão: "Experiência prévia" pesa mais que pensávamos'
                        size="small"
                        variant="outlined"
                        color="success"
                      />
                      <Chip
                        label='Empresa X valoriza "Proximidade Familiar"'
                        size="small"
                        variant="outlined"
                        color="success"
                      />
                      <Chip
                        label="Candidatos com curso técnico ficam mais tempo"
                        size="small"
                        variant="outlined"
                        color="success"
                      />
                      <Chip
                        label="Profissão Y: escolaridade menos importante"
                        size="small"
                        variant="outlined"
                        color="success"
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Ajuste Automático */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: alpha(theme.palette.warning.main, 0.08),
                  border: '2px solid',
                  borderColor: 'warning.main',
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                      <Iconify icon="solar:settings-minimalistic-bold" width={32} {...({} as any)} />
                    </Avatar>
                    <Typography variant="h6">⚙️ 3. Ajuste de Pesos</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Machine Learning reajusta critérios:</strong>
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" display="block" gutterBottom>
                          Tempo na Fila
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={70}
                          color="warning"
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          70 pts → 65 pts (se dados indicarem)
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" display="block" gutterBottom>
                          Proximidade
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={30}
                          color="warning"
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          30 pts → 20 pts
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" display="block" gutterBottom>
                          🆕 Experiência Prévia (novo critério)
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={15}
                          color="success"
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="success.main" fontWeight={600}>
                          0 pts → 15 pts (descoberto pelo Machine Learning!)
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Melhoria Contínua */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  border: '2px solid',
                  borderColor: 'error.main',
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                      <Iconify icon="solar:chart-2-bold" width={32} {...({} as any)} />
                    </Avatar>
                    <Typography variant="h6">📈 4. Resultados Mensuráveis</Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Métricas de sucesso:</strong>
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">Taxa de Aceitação Top 1</Typography>
                          <Chip label="60% → 92%" color="error" size="small" />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={92}
                          color="error"
                          sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                        />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">Escolhas Manuais (Fora Top 5)</Typography>
                          <Chip label="40% → 8%" color="success" size="small" />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={8}
                          color="success"
                          sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                        />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">Permanência Média (dias)</Typography>
                          <Chip label="180 → 365" color="primary" size="small" />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={100}
                          color="primary"
                          sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Futuro com Inteligência Artificial */}
          <Card
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: '2px dashed',
              borderColor: 'primary.main',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 64,
                    height: 64,
                    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }}
                >
                  <Iconify icon="solar:stars-bold" width={36} {...({} as any)} />
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ mb: 0.5 }}>
                    🔮 Visão de Futuro: Inteligência Artificial Generativa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recursos planejados para próximas versões
                  </Typography>
                </Box>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <Iconify icon="solar:chat-round-dots-bold" width={32} color="primary.main" />
                    <Typography variant="caption" fontWeight={600}>
                      Processamento de Linguagem Natural para análise de ocorrências
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <Iconify icon="solar:danger-triangle-bold" width={32} color="warning.main" />
                    <Typography variant="caption" fontWeight={600}>
                      Predição de riscos de desligamento
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <Iconify icon="solar:chart-2-bold" width={32} color="success.main" {...({} as any)} />
                    <Typography variant="caption" fontWeight={600}>
                      Previsão de demanda de vagas
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <Iconify icon="solar:lamp-bold" width={32} color="info.main" {...({} as any)} />
                    <Typography variant="caption" fontWeight={600}>
                      Sugestões proativas de capacitação
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Stack spacing={2}>
        <Alert severity="info">
          <AlertTitle>📌 Escolha Manual</AlertTitle>
          Servidor pode escolher <strong>qualquer candidato fora do Top 5</strong>, mas deve informar <strong>motivo obrigatório</strong> (ocorrência pré-cadastrada). Essas decisões alimentam o Machine Learning!
        </Alert>
        
        <Alert severity="warning">
          <AlertTitle>⚠️ Blacklist não é filtro</AlertTitle>
          Reeducandos em blacklist <strong>não têm Ficha Cadastral ativa</strong>, então já estão fora automaticamente. Não precisa verificar blacklist no matching.
        </Alert>

        <Alert severity="success" icon={<Iconify icon="solar:cup-star-bold" width={24} {...({} as any)} />}>
          <AlertTitle>🏆 De 2h para 5min: A Transformação</AlertTitle>
          Antes do SAGEP: servidor levava <strong>2 horas</strong> analisando candidatos manualmente. 
          Com matching + Machine Learning: processo reduzido para <strong>5 minutos</strong> com 92% de precisão! 🚀
        </Alert>
      </Stack>
    </Stack>
  );
}

