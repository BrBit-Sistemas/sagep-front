import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MODULES = [
  {
    category: 'Core',
    modules: [
      {
        icon: 'solar:home-angle-bold',
        title: 'Carceragem & Triagem',
        description: 'BIC digital, biometria, alocação em celas, período de adaptação',
        features: ['Registro biométrico', 'Classificação automática', 'Alertas de mandados'],
        color: '#0EA5E9',
      },
      {
        icon: 'solar:health-bold',
        title: 'Saúde Prisional',
        description: 'Anamnese, testes rápidos, prontuário eletrônico, telemedicina',
        features: ['Controle de medicamentos', 'Calendário de vacinação', 'Exames laboratoriais'],
        color: '#10B981',
      },
      {
        icon: 'solar:hand-heart-bold',
        title: 'Assistência Social',
        description: 'Laudos CTC, apoio familiar, documentação, auxílio reclusão',
        features: ['Rede de apoio', 'Preparação egresso', 'Comunicação de óbitos'],
        color: '#EC4899',
      },
      {
        icon: 'solar:health-bold',
        title: 'Psicologia',
        description: 'Atendimento confidencial, laudos, avaliação de risco',
        features: ['Prontuário sigiloso', 'Terapia em grupo', 'Evolução clínica'],
        color: '#8B5CF6',
      },
    ],
  },
  {
    category: 'Reinserção',
    modules: [
      {
        icon: 'solar:book-bookmark-bold',
        title: 'Educação',
        description: 'ENEM, ENCCEJA, remição por leitura, certificados digitais',
        features: ['Biblioteca digital', 'Controle de frequência', 'Remição automática'],
        color: '#F59E0B',
      },
      {
        icon: 'solar:case-round-bold',
        title: 'Trabalho & Pecúlio',
        description: 'Vagas internas/externas, matching inteligente, folha de pagamento',
        features: ['Portal de empresas', 'Blacklist automática', 'Integração bancária'],
        color: '#06B6D4',
      },
    ],
  },
  {
    category: 'Jurídico',
    modules: [
      {
        icon: 'solar:scale-bold',
        title: 'Execução Penal',
        description: 'Cálculo de penas, ofícios automáticos, integração SEEU',
        features: ['Petições 1 clique', 'Alertas de prazos', 'Controle de remições'],
        color: '#EF4444',
      },
      {
        icon: 'solar:shield-check-bold',
        title: 'Inteligência',
        description: 'Mapeamento de facções, análise de comportamento, IA preditiva',
        features: ['Rede criminosa', 'Alertas de risco', 'Denúncias anônimas'],
        color: '#7C3AED',
      },
    ],
  },
  {
    category: 'Operacional',
    modules: [
      {
        icon: 'solar:user-check-bold',
        title: 'Visitas',
        description: 'Agendamento online, validação biométrica, controle de materiais',
        features: ['Portal do visitante', 'Reconhecimento facial', 'Lista de suspeitos'],
        color: '#14B8A6',
      },
      {
        icon: 'solar:map-arrow-up-bold',
        title: 'Movimentação',
        description: 'Rastreamento em tempo real, biometria facial, histórico completo',
        features: ['Controle de portaria', 'Alertas de atraso', 'Protocolo de fuga'],
        color: '#F97316',
      },
      {
        icon: 'solar:bus-bold',
        title: 'Escolta & Frota',
        description: 'Gestão de veículos, manutenção, rastreamento GPS',
        features: ['Checklist vistoria', 'Controle de custos', 'Comunicação em rota'],
        color: '#64748B',
      },
    ],
  },
  {
    category: 'Gestão',
    modules: [
      {
        icon: 'solar:buildings-3-bold',
        title: 'Governança',
        description: 'Gestão de pessoal, licitações, almoxarifado, corregedoria',
        features: ['Dashboard executivo', 'KPIs', 'Portal do servidor'],
        color: '#3B82F6',
      },
      {
        icon: 'solar:smartphone-2-bold',
        title: 'Telefonia',
        description: 'Ligações monitoradas, gravação, análise de áudio (IA)',
        features: ['Alertas de conteúdo suspeito', 'Controle de créditos', 'Lista autorizada'],
        color: '#10B981',
      },
    ],
  },
];

export function ModulesSection() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('Core');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const currentModules = MODULES.find((cat) => cat.category === currentTab)?.modules || [];

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
          Módulos do Sistema
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.75rem' },
            fontWeight: 800,
            maxWidth: 700,
          }}
        >
          13+ Módulos Integrados
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '1.125rem',
            maxWidth: 700,
          }}
        >
          Cada módulo foi desenvolvido para atender necessidades específicas do sistema prisional, com integração total entre eles
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
          {MODULES.map((category) => (
            <Tab key={category.category} label={category.category} value={category.category} />
          ))}
        </Tabs>
      </Box>

      {/* Modules Grid */}
      <Grid container spacing={3}>
        {currentModules.map((module, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: module.color,
                  transform: 'translateY(-8px)',
                  boxShadow: `0 16px 32px ${alpha(module.color, 0.2)}`,
                },
              }}
            >
              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(module.color, 0.15)} 0%, transparent 70%)`,
                }}
              />

              <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(module.color, 0.12),
                  }}
                >
                  <Iconify
                    icon={module.icon as any}
                    width={28}
                    sx={{ color: module.color }}
                  />
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                  }}
                >
                  {module.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    minHeight: 60,
                  }}
                >
                  {module.description}
                </Typography>

                {/* Features */}
                <Stack spacing={0.5}>
                  {module.features.map((feature, idx) => (
                    <Stack key={idx} direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          bgcolor: module.color,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom info */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          border: '1px dashed',
          borderColor: alpha(theme.palette.primary.main, 0.24),
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap">
          <Iconify icon="solar:info-circle-bold" width={24} sx={{ color: 'primary.main' }} />
          <Typography variant="body2" fontWeight={600}>
            Todos os módulos são totalmente integrados e compartilham dados em tempo real
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

