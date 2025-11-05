import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import { alpha } from '@mui/material/styles';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ROADMAP = [
  {
    phase: 'Fase 1',
    title: 'MVP - Módulos Essenciais',
    status: 'completed',
    progress: 85,
    timeframe: 'Q1-Q2 2025',
    color: '#10B981',
    items: [
      'Carceragem & Triagem com BIC digital',
      'Trabalho & Pecúlio (matching inteligente)',
      'Execução Penal com integração SEEU',
      'Portal de autenticação e permissões',
      'Dashboard executivo com KPIs',
    ],
  },
  {
    phase: 'Fase 2',
    title: 'Expansão Operacional',
    status: 'in_progress',
    progress: 40,
    timeframe: 'Q2-Q3 2025',
    color: '#F59E0B',
    items: [
      'Saúde Prisional completa',
      'Educação com remição automática',
      'Sistema de visitas (social, íntima, advogado)',
      'Movimentação com biometria facial',
      'Inteligência & análise de risco',
    ],
  },
  {
    phase: 'Fase 3',
    title: 'IA & Automação Avançada',
    status: 'planned',
    progress: 0,
    timeframe: 'Q3-Q4 2025',
    color: '#8B5CF6',
    items: [
      'IA preditiva para prevenção de incidentes',
      'Análise de comportamento automatizada',
      'Reconhecimento facial em toda unidade',
      'Chatbot para atendimento automatizado',
      'Relatórios inteligentes com insights',
    ],
  },
  {
    phase: 'Fase 4',
    title: 'Governança & Gestão Nacional',
    status: 'planned',
    progress: 0,
    timeframe: 'Q4 2025 - Q1 2026',
    color: '#3B82F6',
    items: [
      'Módulo completo de governança',
      'Gestão de pessoal e escalas',
      'Almoxarifado e patrimônio',
      'Licitações e contratações',
      'Corregedoria digital (PAD)',
      'Dashboard para governadores e secretários',
    ],
  },
  {
    phase: 'Fase 5',
    title: 'Expansão Nacional',
    status: 'planned',
    progress: 0,
    timeframe: '2026',
    color: '#EC4899',
    items: [
      'Implantação em todos os 27 estados',
      'Integração com todos os TJs do Brasil',
      'Central nacional de dados prisionais',
      'Sistema unificado de transferências',
      'Portal público de transparência',
    ],
  },
];

const STATUS_CONFIG = {
  completed: { label: 'Concluído', color: '#10B981' },
  in_progress: { label: 'Em Progresso', color: '#F59E0B' },
  planned: { label: 'Planejado', color: '#6B7280' },
};

export function RoadmapSection() {

  return (
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
          Roadmap de Implementação
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.75rem' },
            fontWeight: 800,
            maxWidth: 700,
          }}
        >
          Do MVP ao Sistema Nacional
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '1.125rem',
            maxWidth: 700,
          }}
        >
          Desenvolvimento incremental com foco em valor desde o primeiro dia
        </Typography>
      </Stack>

      {/* Timeline */}
      <Timeline
        position="alternate"
        sx={{
          '& .MuiTimelineItem-root:before': {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {ROADMAP.map((phase, index) => {
          const statusConfig = STATUS_CONFIG[phase.status as keyof typeof STATUS_CONFIG];
          const isLast = index === ROADMAP.length - 1;

          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: phase.color,
                    width: 16,
                    height: 16,
                    m: 0,
                    boxShadow: `0 0 0 4px ${alpha(phase.color, 0.24)}`,
                  }}
                />
                {!isLast && (
                  <TimelineConnector
                    sx={{
                      bgcolor: alpha(phase.color, 0.24),
                      width: 2,
                    }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ pb: index === ROADMAP.length - 1 ? 0 : 4 }}>
                <Card
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: phase.color,
                    bgcolor: alpha(phase.color, 0.04),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${alpha(phase.color, 0.2)}`,
                    },
                  }}
                >
                  <Stack spacing={2}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                          label={phase.phase}
                          size="small"
                          sx={{
                            bgcolor: phase.color,
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                        <Chip
                          label={statusConfig.label}
                          size="small"
                          variant="soft"
                          sx={{
                            bgcolor: alpha(statusConfig.color, 0.16),
                            color: statusConfig.color,
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: phase.color,
                        }}
                      >
                        {phase.timeframe}
                      </Typography>
                    </Stack>

                    {/* Title */}
                    <Typography variant="h5" fontWeight={700}>
                      {phase.title}
                    </Typography>

                    {/* Progress Bar */}
                    {phase.progress > 0 && (
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" fontWeight={600}>
                            Progresso
                          </Typography>
                          <Typography variant="caption" fontWeight={700} sx={{ color: phase.color }}>
                            {phase.progress}%
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(phase.color, 0.16),
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${phase.progress}%`,
                              height: '100%',
                              bgcolor: phase.color,
                              borderRadius: 3,
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Items */}
                    <Stack spacing={1}>
                      {phase.items.map((item, idx) => (
                        <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                          <Iconify
                            icon="solar:check-circle-bold"
                            width={18}
                            sx={{
                              color: phase.color,
                              mt: 0.25,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.6,
                            }}
                          >
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Stack>
  );
}

