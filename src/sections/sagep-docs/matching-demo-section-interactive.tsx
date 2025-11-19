import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Candidato = {
  id: string;
  nome: string;
  diasFila: number;
  distanciaKm: number;
  escolaridade: number;
  jaTrabalhouFunap: boolean;
  temExperiencia: boolean;
  fezCurso: boolean;
};

const CANDIDATOS_INICIAIS: Candidato[] = [
  { id: '1', nome: 'João Silva', diasFila: 180, distanciaKm: 2.5, escolaridade: 4, jaTrabalhouFunap: true, temExperiencia: true, fezCurso: true },
  { id: '2', nome: 'Maria Santos', diasFila: 150, distanciaKm: 5.0, escolaridade: 6, jaTrabalhouFunap: true, temExperiencia: false, fezCurso: true },
  { id: '3', nome: 'Carlos Souza', diasFila: 90, distanciaKm: 8.3, escolaridade: 8, jaTrabalhouFunap: false, temExperiencia: true, fezCurso: true },
  { id: '4', nome: 'Ana Lima', diasFila: 60, distanciaKm: 15.7, escolaridade: 6, jaTrabalhouFunap: true, temExperiencia: false, fezCurso: false },
  { id: '5', nome: 'Pedro Costa', diasFila: 45, distanciaKm: 12.3, escolaridade: 4, jaTrabalhouFunap: false, temExperiencia: false, fezCurso: true },
];

// ----------------------------------------------------------------------

function calcularScore(candidato: Candidato, todosCanditados: Candidato[]) {
  const maxDias = Math.max(...todosCanditados.map(c => c.diasFila));
  const minDistancia = Math.min(...todosCanditados.map(c => c.distanciaKm));
  
  // 🕐 Tempo na fila (70 pts) - PESO PRINCIPAL
  const scoreTempo = (candidato.diasFila / maxDias) * 70;
  
  // 📍 Distância (30 pts) - ÚNICO outro critério
  const scoreDistancia = (minDistancia / candidato.distanciaKm) * 30;
  
  const scoreTotal = scoreTempo + scoreDistancia;
  
  return {
    scoreTotal: Math.min(scoreTotal, 100),
    scoreTempo,
    scoreDistancia,
  };
}

// ----------------------------------------------------------------------

type CandidatoComScore = Candidato & {
  scoreTotal: number;
  scoreTempo: number;
  scoreDistancia: number;
};

export function MatchingDemoSectionInteractive() {
  const theme = useTheme();
  const [candidatos, setCandidatos] = useState<Candidato[]>(CANDIDATOS_INICIAIS);
  const [calculando, setCalculando] = useState(false);
  
  // Calcular ranking inicial
  const [ranking, setRanking] = useState<CandidatoComScore[]>(() => {
    const scores = CANDIDATOS_INICIAIS.map(c => ({
      ...c,
      ...calcularScore(c, CANDIDATOS_INICIAIS),
    }));
    return scores.sort((a, b) => b.scoreTotal - a.scoreTotal);
  });

  const handleCalcular = () => {
    setCalculando(true);
    
    setTimeout(() => {
      // Recalcular scores com os dados atualizados
      const scores = candidatos.map(c => ({
        ...c,
        ...calcularScore(c, candidatos),
      }));
      const novoRanking = scores.sort((a, b) => b.scoreTotal - a.scoreTotal);
      
      setRanking(novoRanking);
      setCalculando(false);
    }, 1500);
  };

  const handleReset = () => {
    setCandidatos(CANDIDATOS_INICIAIS);
    
    // Recalcular ranking com dados iniciais
    const scores = CANDIDATOS_INICIAIS.map(c => ({
      ...c,
      ...calcularScore(c, CANDIDATOS_INICIAIS),
    }));
    setRanking(scores.sort((a, b) => b.scoreTotal - a.scoreTotal));
  };

  const updateCandidato = (id: string, field: keyof Candidato, value: any) => {
    setCandidatos(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <Box id="demo" sx={{ bgcolor: 'background.default', py: 10, position: 'relative', overflow: 'hidden' }}>
      {/* Efeitos de fundo NASA */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          '@keyframes rotate': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
          animation: 'rotate 20s linear infinite',
        }}
      />
      
      <Container maxWidth="xl">
        <Typography variant="h2" align="center" sx={{ mb: 2 }}>
          🎯 Motor de Matching Inteligente
          <Chip 
            label="DEMO INTERATIVA" 
            color="warning" 
            sx={{ ml: 2, fontWeight: 700 }} 
          />
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 1 }}>
          Simule o algoritmo em tempo real! Ajuste os parâmetros e veja os scores mudarem.
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
          <Typography variant="body2">
            💡 <strong>Experimente:</strong> Mude os dias na fila, distância ou escolaridade dos candidatos 
            e clique em &quot;Calcular Matches&quot; para ver o ranking atualizar em tempo real!
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          {/* Vaga (Fixa - Contexto) */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%', 
                boxShadow: `0 8px 32px ${alpha(theme.palette.success.main, 0.15)}`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.lighter, 0.3)} 0%, ${alpha(theme.palette.success.lighter, 0.1)} 100%)`,
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  color: 'white',
                  py: 2.5,
                  px: 2,
                  textAlign: 'center',
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`,
                    mx: 'auto',
                    mb: 1.5,
                    width: 56,
                    height: 56,
                  }}
                >
                  <Typography fontSize="1.5rem">📋</Typography>
                </Avatar>
                
                <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
                  Vaga Disponível
                </Typography>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: alpha(theme.palette.common.white, 0.85),
                    display: 'block'
                  }}
                >
                  Contexto da simulação
                </Typography>
              </Box>
              <CardContent sx={{ pt: 3 }}>
                <Stack spacing={2.5}>
                  {/* Profissão com ícone */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 1.5, 
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify icon="solar:case-round-bold" width={24} sx={{ color: 'white' }} {...({} as any)} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Profissão
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          Pedreiro
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  
                  {/* Local + Vagas */}
                  <Stack direction="row" spacing={1.5}>
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        📍 Local
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        Taguatinga - DF
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        📊 Vagas
                      </Typography>
                      <Chip 
                        label="50" 
                        color="success" 
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Stack>
                  
                  <Divider />
                  
                  {/* Requisitos com visual melhorado */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Iconify icon="solar:shield-check-bold" width={18} color="success.main" />
                      Requisitos Obrigatórios
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1.5 }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                        }}
                      >
                        <Typography variant="caption" fontWeight={600} color="success.dark">
                          ✅ Regime: Semiaberto/Aberto
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                        }}
                      >
                        <Typography variant="caption" fontWeight={600} color="success.dark">
                          ✅ Escolaridade Mín: Fund. II (nível 4)
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                        }}
                      >
                        <Typography variant="caption" fontWeight={600} color="error.dark">
                          ❌ Artigos vedados: CP:157, CP:121
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Algoritmo */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%', 
                background: calculando 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.warning.lighter, 0.8)} 0%, ${alpha(theme.palette.warning.light, 0.6)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.lighter, 0.4)} 0%, ${alpha(theme.palette.info.lighter, 0.3)} 100%)`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: calculando 
                  ? `0 12px 40px ${alpha(theme.palette.warning.main, 0.25)}`
                  : `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {/* Círculo externo girando */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: `2px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
                      animation: calculando ? 'rotate 2s linear infinite' : 'none',
                    }}
                  />
                  
                  {/* Anel intermediário */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 100,
                      height: 100,
                      top: 10,
                      left: 10,
                      borderRadius: '50%',
                      border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    }}
                  />
                  
                  {/* Círculo central com gradiente */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      top: 20,
                      left: 20,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: calculando 
                        ? `0 0 30px ${alpha(theme.palette.warning.main, 0.6)}`
                        : `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s',
                    }}
                  >
                    <Iconify 
                      icon="solar:settings-bold" 
                      width={40} 
                      sx={{ 
                        color: 'white',
                        transform: calculando ? 'rotate(360deg)' : 'rotate(0deg)',
                        transition: 'transform 2s linear',
                      }} 
                    />
                  </Box>
                </Box>
                
                <Typography variant="h5" gutterBottom>
                  {calculando ? '⚡ Calculando...' : 'Algoritmo de Matching'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {calculando ? 'Processando...' : 'Ajuste os dados e recalcule'}
                </Typography>
                
                <Stack spacing={2.5}>
                  {[
                    { label: '🕐 Tempo na Fila (FIFO)', value: 70, color: 'primary', desc: 'Prioridade absoluta' },
                    { label: '📍 Proximidade (CEP)', value: 30, color: 'success', desc: 'Distância ao local' },
                  ].map((item, idx) => (
                    <Box key={idx}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Box>
                          <Typography variant="caption" fontWeight={600}>{item.label}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block" fontSize="0.65rem">
                            {item.desc}
                          </Typography>
                        </Box>
                        <Chip 
                          label={`${item.value} pts`} 
                          size="small" 
                          color={item.color as any}
                          sx={{ fontWeight: 700, height: 24 }}
                        />
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(item.value / 70) * 100} 
                        color={item.color as any}
                        sx={{ 
                          height: 12, 
                          borderRadius: 1,
                          bgcolor: alpha((theme.palette as any)[item.color].main, 0.1),
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
                
                <Stack spacing={1} sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleCalcular}
                    disabled={calculando}
                    startIcon={calculando ? null : <Iconify icon="solar:play-bold" {...({} as any)} />}
                    color="warning"
                    sx={{ fontWeight: 700 }}
                  >
                    {calculando ? 'Processando...' : '⚡ Calcular Matches'}
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={handleReset}
                    size="small"
                    startIcon={<Iconify icon="solar:restart-bold" />}
                  >
                    Resetar Demo
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Top 5 Candidatos (Editáveis) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h6" gutterBottom>
                🏆 Top 5 Candidatos - Ranking Dinâmico
                <Chip 
                  label="Edite os valores e recalcule" 
                  size="small" 
                  color="info" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              {/* Sempre mostrar o ranking (calculado ou inicial) */}
              {ranking.slice(0, 5).map((candidatoRanking, idx) => {
                // Buscar os dados editáveis do state de candidatos
                const candidatoEditavel = candidatos.find(c => c.id === candidatoRanking.id) || candidatoRanking;
                const colors = ['success', 'warning', 'info', 'error', 'primary'];
                const color = colors[idx];
                
                return (
                  <Card 
                    key={candidatoRanking.id} 
                    sx={{ 
                      borderLeft: 4, 
                      borderColor: `${color}.main`,
                      transition: 'all 0.5s ease',
                      transform: calculando ? 'scale(0.98)' : 'scale(1)',
                      opacity: calculando ? 0.6 : 1,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {/* Posição */}
                        <Avatar 
                          sx={{ 
                            bgcolor: `${color}.main`,
                            width: 48,
                            height: 48,
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            transition: 'all 0.5s ease',
                          }}
                        >
                          {idx + 1}º
                        </Avatar>
                        
                        {/* Nome e dados editáveis (compacto) */}
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {candidatoRanking.nome}
                          </Typography>
                          
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                            <TextField
                              size="small"
                              label="Dias na Fila"
                              type="number"
                              value={candidatoEditavel.diasFila || ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Number(e.target.value);
                                updateCandidato(candidatoEditavel.id, 'diasFila', val);
                              }}
                              sx={{ width: 110 }}
                              InputProps={{ sx: { fontSize: '0.75rem' } }}
                              inputProps={{ min: 0 }}
                            />
                            <TextField
                              size="small"
                              label="Distância (km)"
                              type="number"
                              value={candidatoEditavel.distanciaKm || ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Number(e.target.value);
                                updateCandidato(candidatoEditavel.id, 'distanciaKm', val);
                              }}
                              sx={{ width: 110 }}
                              InputProps={{ sx: { fontSize: '0.75rem' } }}
                              inputProps={{ min: 0, step: 0.1 }}
                            />
                          </Stack>
                        </Box>
                        
                        {/* Score com animação */}
                        <Box 
                          textAlign="right" 
                          sx={{ 
                            minWidth: 100,
                            transition: 'all 0.5s ease',
                          }}
                        >
                          <Typography 
                            variant="h3" 
                            color={`${color}.main`}
                            sx={{ 
                              fontWeight: 800,
                              textShadow: `0 0 20px ${alpha((theme.palette as any)[color].main, 0.5)}`,
                            }}
                          >
                            {candidatoRanking.scoreTotal.toFixed(1)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Match Score
                          </Typography>
                        </Box>
                      </Stack>
                      
                      {/* Breakdown de scores - sempre visível */}
                      <Box 
                        sx={{ 
                          mt: 2, 
                          pt: 2, 
                          borderTop: 1, 
                          borderColor: 'divider',
                        }}
                      >
                        <Stack spacing={1.5}>
                          {/* Tempo na fila */}
                          <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Iconify icon="solar:clock-circle-bold" width={18} color="primary.main" />
                                <Typography variant="caption" fontWeight={600}>
                                  Tempo na Fila (70 pts)
                                </Typography>
                              </Stack>
                              <Typography variant="caption" fontWeight={700} color="primary.main">
                                {candidatoRanking.scoreTempo.toFixed(1)} pts
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={(candidatoRanking.scoreTempo / 70) * 100}
                              color="primary"
                              sx={{ height: 6, borderRadius: 1 }}
                            />
                          </Box>
                          
                          {/* Proximidade */}
                          <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Iconify icon="solar:map-point-bold" width={18} color="success.main" {...({} as any)} />
                                <Typography variant="caption" fontWeight={600}>
                                  Proximidade (30 pts)
                                </Typography>
                              </Stack>
                              <Typography variant="caption" fontWeight={700} color="success.main">
                                {candidatoRanking.scoreDistancia.toFixed(1)} pts
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              variant="determinate" 
                              value={(candidatoRanking.scoreDistancia / 30) * 100}
                              color="success"
                              sx={{ height: 6, borderRadius: 1 }}
                            />
                          </Box>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Mensagem com o melhor candidato */}
              <Alert 
                severity="success" 
                icon={<Iconify icon="solar:cup-star-bold" width={24} />}
              >
                <Typography variant="subtitle2">
                  🏆 <strong>{ranking[0]?.nome || 'Nenhum candidato'}</strong> está em 1º lugar com <strong>{ranking[0]?.scoreTotal.toFixed(1) || 0}%</strong> de compatibilidade!
                </Typography>
              </Alert>
            </Stack>
          </Grid>
        </Grid>
        
        {/* Legenda explicativa */}
        <Box sx={{ mt: 6, p: 3, bgcolor: alpha(theme.palette.info.main, 0.08), borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={700}>
            📖 Como funciona a pontuação:
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.08), border: 'none' }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify icon="solar:clock-circle-bold" width={24} color="primary.main" />
                  <Box>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      🕐 Tempo na Fila - 70 pontos (FIFO)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Prioridade absoluta.</strong> Quem está há mais tempo recebe 70 pts. 
                      Demais candidatos recebem pontuação proporcional ao tempo de espera. 
                      Sistema FIFO (First In, First Out) rigoroso.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.08), border: 'none' }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify icon="solar:map-point-bold" width={24} color="success.main" {...({} as any)} />
                  <Box>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>
                      📍 Proximidade - 30 pontos (CEP)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Distância geográfica.</strong> Candidato mais próximo do local de trabalho 
                      recebe 30 pts. Demais recebem pontuação inversamente proporcional à distância (km).
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

