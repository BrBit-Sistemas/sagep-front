import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const USE_CASES = [
  {
    category: 'Operacional',
    icon: 'solar:widget-5-bold',
    color: '#0EA5E9',
    cases: [
      {
        title: '🚨 Conflito Iminente Detectado',
        problem: 'Setor de Inteligência identifica movimentações suspeitas e conversas sobre possível conflito',
        solution: [
          'IA analisa padrões de comportamento e ligações telefônicas',
          'Sistema alerta gestão em tempo real',
          'Sugestão automática de transferências preventivas',
          'Reforço de segurança acionado automaticamente',
          'Histórico completo de incidentes preservado para auditoria',
        ],
        impact: 'Conflito evitado, 0 vítimas, economia de R$ 500mil em danos',
      },
      {
        title: '⚖️ Progressão de Regime Automática',
        problem: 'Detento cumpriu requisitos para progressão mas processo manual demora meses',
        solution: [
          'Sistema calcula automaticamente quando detento atinge requisitos',
          'Alerta jurídico 30 dias antes da data-base',
          'Ofício de progressão gerado com 1 clique',
          'Integração SEEU envia petição automaticamente',
          'Acompanhamento do processo em tempo real',
        ],
        impact: 'Processo que levava 4 meses agora leva 15 dias',
      },
      {
        title: '🏥 Emergência Médica Gerenciada',
        problem: 'Detento passa mal e precisa de atendimento externo urgente',
        solution: [
          'Sistema aciona protocolo de emergência automaticamente',
          'Escolta qualificada designada conforme periculosidade',
          'Viatura disponível identificada e alocada',
          'Comunicação em tempo real com hospital',
          'Biometria facial confirma retorno do detento correto',
        ],
        impact: 'Atendimento em 12 minutos (antes: 45min), 0 erros de identificação',
      },
    ],
  },
  {
    category: 'Estratégico',
    icon: 'solar:chart-2-bold',
    color: '#8B5CF6',
    cases: [
      {
        title: '📊 Superlotação Prevista com 6 Meses de Antecedência',
        problem: 'Estado não sabe quando precisará de novo presídio, descobrindo apenas quando já está em crise',
        solution: [
          'IA analisa taxa de crescimento da população carcerária',
          'Previsão de capacidade por unidade nos próximos 12 meses',
          'Alerta ao governador: "Novo presídio necessário em 6 meses"',
          'Simulação de cenários (construir vs ampliar unidade existente)',
          'Integração com planejamento orçamentário do estado',
        ],
        impact: 'Estado planejou construção com 6 meses de antecedência, evitando crise',
      },
      {
        title: '👮 Déficit de Policiais Penais Identificado',
        problem: 'Escalas sobrecarregadas, mas gestão não tem dados precisos para justificar contratação',
        solution: [
          'IA calcula: Total de presos ÷ Policiais disponíveis ÷ Turnos',
          'Sistema indica: "Déficit de 47 policiais na Unidade X"',
          'Dashboard mostra impacto: horas extras aumentaram 35%',
          'Relatório automático gerado para Secretaria',
          'Justificativa técnica para licitação de concurso público',
        ],
        impact: 'Concurso aprovado em 2 meses (antes: 1 ano de debate)',
      },
      {
        title: '💰 Economia de R$ 2.3mi/ano em Processos Automatizados',
        problem: 'Servidores gastam 60% do tempo gerando documentos repetitivos manualmente',
        solution: [
          'Ofícios, laudos e relatórios gerados com 1 clique',
          'Integração SEEU elimina digitação manual de petições',
          'Remição calculada automaticamente (trabalho + estudo + leitura)',
          'Dashboard de BI elimina relatórios manuais para CNJ',
          'Servidor foca em atividades estratégicas, não operacionais',
        ],
        impact: 'Produtividade aumentou 400%, tempo médio de processos caiu 75%',
      },
    ],
  },
  {
    category: 'Reinserção',
    icon: 'solar:hand-heart-bold',
    color: '#10B981',
    cases: [
      {
        title: '💼 Reeducando Alocado em Vaga em 48 Horas',
        problem: 'Processo manual de matching detento-vaga demorava semanas e era subjetivo',
        solution: [
          'Matching inteligente: vaga x perfil do reeducando (profissão, regime, escolaridade)',
          'Validação automática de artigos vedados pelo convênio',
          'Pontua ção objetiva: Tempo na fila (70%) + Proximidade (30%)',
          'Empresa recebe indicação automaticamente',
          'Blacklist automática em caso de desligamento grave',
        ],
        impact: 'Tempo de alocação caiu de 3 semanas para 48h, 95% de satisfação',
      },
      {
        title: '📚 Remição Automática por Educação',
        problem: 'Cálculo manual de remição era lento e sujeito a erros',
        solution: [
          'Sistema registra: 3 dias de estudo = 1 dia de remição',
          'Frequência escolar controlada digitalmente',
          'Leitura de livro: resenha validada = remição automática',
          'Cálculo consolidado mensal',
          'Ofício de remição gerado e enviado ao juiz com 1 clique',
        ],
        impact: '100% de precisão, processo que levava 2 meses agora é instantâneo',
      },
    ],
  },
];

export function UseCasesSection() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('Operacional');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const currentCategory = USE_CASES.find((cat) => cat.category === currentTab);
  const currentCases = currentCategory?.cases || [];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={6}>
          {/* Section Header */}
          <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: 1.5,
              }}
            >
              Casos de Uso Reais
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                maxWidth: 700,
              }}
            >
              Problemas Reais, Soluções Inteligentes
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.125rem',
                maxWidth: 700,
              }}
            >
              Veja como o sistema resolve desafios críticos do dia a dia das unidades prisionais
            </Typography>
          </Stack>

          {/* Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textTransform: 'none',
                },
              }}
            >
              {USE_CASES.map((category) => (
                <Tab
                  key={category.category}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon={category.icon as any} width={18} />
                      <span>{category.category}</span>
                    </Stack>
                  }
                  value={category.category}
                />
              ))}
            </Tabs>
          </Box>

          {/* Use Cases */}
          <Stack spacing={4}>
            {currentCases.map((useCase, index) => (
              <Card
                key={index}
                sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: currentCategory?.color,
                    boxShadow: `0 12px 24px ${alpha(currentCategory?.color || '#000', 0.15)}`,
                  },
                }}
              >
                <Stack spacing={3}>
                  {/* Title */}
                  <Typography variant="h5" fontWeight={700}>
                    {useCase.title}
                  </Typography>

                  {/* Problem */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      borderLeft: '4px solid',
                      borderColor: 'error.main',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Iconify
                        icon={"solar:danger-bold" as any}
                        width={24}
                        sx={{ color: 'error.main', flexShrink: 0, mt: 0.25 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                          ❌ Problema Atual
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {useCase.problem}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Solution */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                      borderLeft: '4px solid',
                      borderColor: 'success.main',
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Iconify
                          icon="solar:check-circle-bold"
                          width={24}
                          sx={{ color: 'success.main' }}
                        />
                        <Typography variant="subtitle2" fontWeight={700}>
                          ✅ Solução com Super SAGEP
                        </Typography>
                      </Stack>
                      <Stack spacing={1} sx={{ pl: 5 }}>
                        {useCase.solution.map((item, idx) => (
                          <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                mt: 1,
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              {item}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Impact */}
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(currentCategory?.color || '#000', 0.08)} 0%, ${alpha(currentCategory?.color || '#000', 0.12)} 100%)`,
                      border: '1px solid',
                      borderColor: alpha(currentCategory?.color || '#000', 0.24),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(currentCategory?.color || '#000', 0.16),
                        }}
                      >
                        <Iconify
                          icon={"solar:chart-square-bold" as any}
                          width={24}
                          sx={{ color: currentCategory?.color }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          💡 IMPACTO REAL
                        </Typography>
                        <Typography variant="body1" fontWeight={700} sx={{ color: currentCategory?.color }}>
                          {useCase.impact}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

