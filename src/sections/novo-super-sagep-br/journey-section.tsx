import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PROCESS_TIMELINES = [
  {
    title: '🚨 Fluxo: Da Prisão à Alocação na Galeria',
    subtitle: 'Tempo médio de adaptação: 7 dias (recaptura: 24h)',
    color: '#EF4444',
    steps: [
      {
        time: 'Instante',
        title: 'Prisão + Notificação Automática',
        icon: 'solar:shield-warning-bold',
        description: 'Prisão em flagrante ou apresentação. Sistema da polícia integrado notifica automaticamente a unidade prisional do ingresso.',
      },
      {
        time: '15-30min',
        title: 'BIC Digital + Identificação Corporal',
        icon: 'solar:camera-bold',
        description: 'BIC eletrônico completo, biometria facial/digital, fotos de identificação corporal (tatuagens, cicatrizes, marcas), mapeamento tecnológico completo.',
      },
      {
        time: '30-45min',
        title: 'Alocação em Cela de Adaptação',
        icon: 'solar:lock-password-bold',
        description: 'Sistema aloca automaticamente em cela provisória. Notificações aos setores: Saúde, Jurídico, Social e Inteligência.',
      },
      {
        time: 'Próximo expediente',
        title: 'Triagem de Saúde (Horário Comercial)',
        icon: 'solar:health-bold',
        description: 'Anamnese, testes rápidos (HIV, TB, COVID), avaliação psicológica. Realizado no próximo expediente de saúde disponível (se prisão noturna, executa no dia seguinte).',
      },
      {
        time: '~7 dias',
        title: 'Aprovação para Galeria Definitiva',
        icon: 'solar:check-circle-bold',
        description: 'Após período de adaptação médio de 7 dias: triagem completa, avaliação de periculosidade, classificação. Recapturas em 24h podem ter processo acelerado.',
      },
    ],
  },
  {
    title: '⚖️ Fluxo: Pedido de Progressão de Regime',
    subtitle: 'Tempo médio: 15-30 dias (antes: 4 meses)',
    color: '#0EA5E9',
    steps: [
      {
        time: 'Dia 1',
        title: 'Sistema Detecta Requisitos',
        icon: 'solar:calendar-date-bold',
        description: 'IA calcula: tempo + conduta + remições',
      },
      {
        time: 'Dia 2',
        title: 'Alerta ao Setor Jurídico',
        icon: 'solar:bell-bold',
        description: 'Notificação: "Detento apto para progressão"',
      },
      {
        time: 'Dia 3',
        title: 'Geração de Ofício',
        icon: 'solar:document-add-bold',
        description: 'Servidor clica 1 botão = Ofício pronto',
      },
      {
        time: 'Dia 4',
        title: 'Envio ao SEEU (CNJ)',
        icon: 'solar:send-square-bold',
        description: 'Certificado digital + Integração automática',
      },
      {
        time: 'Dia 15-30',
        title: 'Decisão Judicial',
        icon: 'solar:scale-bold',
        description: 'Acompanhamento em tempo real',
      },
    ],
  },
  {
    title: '💼 Fluxo: Alocação em Vaga de Trabalho',
    subtitle: 'Tempo médio: 48 horas (antes: 3 semanas)',
    color: '#10B981',
    steps: [
      {
        time: '0h',
        title: 'Empresa Cadastra Vaga',
        icon: 'solar:case-round-bold',
        description: 'Portal empresas + Requisitos',
      },
      {
        time: '5min',
        title: 'Matching Inteligente',
        icon: 'solar:cpu-bolt-bold',
        description: 'IA filtra: profissão + regime + artigos',
      },
      {
        time: '15min',
        title: 'Ranking Automático',
        icon: 'solar:list-bold',
        description: 'Tempo fila (70%) + Proximidade (30%)',
      },
      {
        time: '24h',
        title: 'Indicação ao Reeducando',
        icon: 'solar:user-check-bold',
        description: 'Sistema notifica + Aceite digital',
      },
      {
        time: '48h',
        title: 'Início do Trabalho',
        icon: 'solar:star-bold',
        description: 'Contrato + Pecúlio + Remição',
      },
    ],
  },
  {
    title: '📊 Fluxo: Governança - Identificação de Déficit de Policiais',
    subtitle: 'Atualização: Tempo real (Dashboard executivo)',
    color: '#8B5CF6',
    steps: [
      {
        time: 'Contínuo',
        title: 'IA Monitora Dados',
        icon: 'solar:eye-bold',
        description: 'Total presos ÷ Policiais ÷ Turnos',
      },
      {
        time: 'Tempo Real',
        title: 'Dashboard Atualiza',
        icon: 'solar:chart-square-bold',
        description: 'KPI: "Déficit de 47 policiais"',
      },
      {
        time: 'Alerta',
        title: 'Secretaria Notificada',
        icon: 'solar:danger-bold',
        description: 'Email + Dashboard + Relatório',
      },
      {
        time: 'Análise',
        title: 'Simulação de Cenários',
        icon: 'solar:calculator-bold',
        description: 'Custo hora extra vs contratação',
      },
      {
        time: 'Decisão',
        title: 'Aprovação de Concurso',
        icon: 'solar:document-text-bold',
        description: 'Relatório técnico pronto para licitação',
      },
    ],
  },
];

export function JourneySection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={8}>
          {/* Section Header */}
          <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
            <Chip
              label="🔄 Processos Automatizados"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                px: 2.5,
                py: 0.5,
                height: 'auto',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                border: '2px solid',
                borderColor: alpha(theme.palette.primary.main, 0.24),
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                maxWidth: 800,
              }}
            >
              Veja Como o Sistema Funciona na Prática
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.125rem',
                maxWidth: 700,
              }}
            >
              4 fluxos reais demonstrando automação, inteligência e integração em cada processo
            </Typography>
          </Stack>

          {/* Process Timelines */}
          <Stack spacing={6}>
            {PROCESS_TIMELINES.map((timeline, tlIndex) => (
              <Card
                key={tlIndex}
                sx={{
                  p: 4,
                  bgcolor: alpha(timeline.color, 0.02),
                  border: '2px solid',
                  borderColor: alpha(timeline.color, 0.2),
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: timeline.color,
                    boxShadow: `0 12px 32px ${alpha(timeline.color, 0.2)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={4}>
                  {/* Timeline Header */}
                  <Stack spacing={1}>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        color: timeline.color,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                      }}
                    >
                      {timeline.title}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                      <Chip
                        icon={<Iconify icon="solar:clock-circle-bold" width={16} />}
                        label={timeline.subtitle}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: alpha(timeline.color, 0.12),
                          color: timeline.color,
                          border: '1px solid',
                          borderColor: alpha(timeline.color, 0.24),
                        }}
                      />
                    </Stack>
                  </Stack>

                  {/* Timeline Steps */}
                  <Box sx={{ position: 'relative' }}>
                    {/* Connecting dotted line */}
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: 32,
                        left: 32,
                        right: 32,
                        height: 2,
                        borderTop: '3px dashed',
                        borderColor: alpha(timeline.color, 0.25),
                        zIndex: 0,
                      }}
                    />

                    {/* Steps Grid */}
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={{ xs: 3, md: 0 }}
                      sx={{ position: 'relative', zIndex: 1 }}
                    >
                      {timeline.steps.map((step, stepIndex) => (
                        <Box
                          key={stepIndex}
                          sx={{
                            flex: 1,
                            px: { xs: 0, md: 2 },
                          }}
                        >
                          <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                            {/* Time Badge */}
                            <Chip
                              label={step.time}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                bgcolor: timeline.color,
                                color: '#fff',
                                minWidth: 60,
                                boxShadow: `0 4px 12px ${alpha(timeline.color, 0.3)}`,
                              }}
                            />

                            {/* Icon Circle */}
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: alpha(timeline.color, 0.12),
                                border: '3px solid',
                                borderColor: timeline.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 0 4px ${alpha(timeline.color, 0.08)}`,
                              }}
                            >
                              <Iconify icon={step.icon as any} width={28} sx={{ color: timeline.color }} />
                            </Box>

                            {/* Step Info */}
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{
                                  mb: 0.5,
                                  minHeight: { xs: 'auto', md: 40 },
                                }}
                              >
                                {step.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  lineHeight: 1.6,
                                  display: 'block',
                                }}
                              >
                                {step.description}
                              </Typography>
                            </Box>

                            {/* Arrow to next step (except last) */}
                            {stepIndex < timeline.steps.length - 1 && (
                              <Box
                                sx={{
                                  display: { xs: 'block', md: 'none' },
                                  width: 2,
                                  height: 30,
                                  bgcolor: alpha(timeline.color, 0.3),
                                  position: 'relative',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -6,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: `8px solid ${alpha(timeline.color, 0.3)}`,
                                  },
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Result/Impact */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(timeline.color, 0.08),
                      border: '1px solid',
                      borderColor: alpha(timeline.color, 0.16),
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify
                        icon={"solar:bolt-circle-bold" as any}
                        width={24}
                        sx={{ color: timeline.color }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        <Box component="span" sx={{ color: timeline.color, fontWeight: 800 }}>
                          Resultado:
                        </Box>{' '}
                        Processo 100% rastreável, notificações automáticas, zero retrabalho manual
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>

          {/* Governança Crosscutting */}
          <Card
            sx={{
              p: 4,
              position: 'relative',
              background: `linear-gradient(135deg, ${alpha('#3B82F6', 0.05)} 0%, ${alpha('#8B5CF6', 0.05)} 100%)`,
              border: '3px dashed',
              borderColor: alpha('#3B82F6', 0.3),
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            {/* Diagonal stripes pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `repeating-linear-gradient(
                  45deg,
                  ${alpha('#3B82F6', 0.03)},
                  ${alpha('#3B82F6', 0.03)} 10px,
                  transparent 10px,
                  transparent 20px
                )`,
                zIndex: 0,
              }}
            />

            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)`,
                    boxShadow: `0 8px 24px ${alpha('#3B82F6', 0.4)}`,
                  }}
                >
                  <Iconify icon={"solar:widget-5-bold" as any} width={44} sx={{ color: '#fff' }} />
                </Box>

                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Typography variant="h4" fontWeight={900}>
                      🏛️ Governança Inteligente
                    </Typography>
                    <Chip
                      label="Crosscutting"
                      size="small"
                      sx={{
                        fontWeight: 800,
                        bgcolor: '#3B82F6',
                        color: '#fff',
                        fontSize: '0.6875rem',
                      }}
                    />
                  </Stack>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    IA monitora e otimiza TODOS os processos simultaneamente
                  </Typography>
                </Stack>
              </Stack>

              {/* Governança Features */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {[
                  {
                    icon: 'solar:chart-square-bold',
                    title: 'Dashboard Executivo',
                    desc: 'KPIs em tempo real',
                  },
                  {
                    icon: 'solar:cpu-bolt-bold',
                    title: 'IA Preditiva',
                    desc: 'Prevê superlotação com 6 meses',
                  },
                  {
                    icon: 'solar:users-group-rounded-bold',
                    title: 'Gestão de Pessoal',
                    desc: 'Calcula déficit de policiais',
                  },
                  {
                    icon: 'solar:buildings-3-bold',
                    title: 'Infraestrutura',
                    desc: 'Indica necessidade de construções',
                  },
                ].map((feature, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#fff', 0.6),
                      border: '2px solid',
                      borderColor: alpha('#3B82F6', 0.2),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3B82F6',
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 16px ${alpha('#3B82F6', 0.15)}`,
                      },
                    }}
                  >
                    <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
                      <Iconify icon={feature.icon as any} width={32} sx={{ color: '#3B82F6' }} />
                      <Typography variant="subtitle2" fontWeight={700} fontSize="0.8125rem">
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontSize="0.6875rem">
                        {feature.desc}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Bottom Summary */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: alpha(theme.palette.success.main, 0.08),
              border: '2px dashed',
              borderColor: alpha(theme.palette.success.main, 0.24),
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap">
              <Iconify icon="solar:check-circle-bold" width={28} sx={{ color: 'success.main' }} />
              <Typography variant="h6" fontWeight={700}>
                <Box component="span" sx={{ color: 'success.main' }}>
                  100% Automatizado
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Notificações em tempo real • Zero retrabalho • Integração total entre setores
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

