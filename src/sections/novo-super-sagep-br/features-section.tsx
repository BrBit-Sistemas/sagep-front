import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: 'solar:shield-check-bold',
    title: 'Integração CNJ (SEEU)',
    description: 'Envio automático de ofícios e petições para a VEP com certificado digital. Integração completa com o sistema do CNJ.',
    color: '#0EA5E9',
  },
  {
    icon: 'solar:user-id-bold',
    title: 'Biometria Facial',
    description: 'Reconhecimento facial em toda movimentação interna e externa. Prevenção de fraudes e identificação instantânea.',
    color: '#8B5CF6',
  },
  {
    icon: 'solar:cpu-bolt-bold',
    title: 'Inteligência Artificial',
    description: 'IA preditiva para análise de comportamento, detecção de padrões suspeitos e antecipação de incidentes.',
    color: '#F59E0B',
  },
  {
    icon: 'solar:chart-2-bold',
    title: 'BI & Dashboards',
    description: 'Painéis executivos em tempo real com KPIs, relatórios personalizados e análise de dados completa.',
    color: '#10B981',
  },
  {
    icon: 'solar:document-text-bold',
    title: 'Documentação Automática',
    description: 'Geração de ofícios, laudos e relatórios com um clique. Modelos padronizados e conformidade garantida.',
    color: '#EC4899',
  },
  {
    icon: 'solar:cloud-check-bold',
    title: 'Cloud & Alta Disponibilidade',
    description: 'Infraestrutura em nuvem com 99.9% de uptime. Acesso de qualquer lugar, backup automático e segurança enterprise.',
    color: '#06B6D4',
  },
];

export function FeaturesSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Stack spacing={2} alignItems="center" sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: 1.5,
            }}
          >
            Por que escolher o Novo Super SAGEP?
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              maxWidth: 700,
            }}
          >
            Recursos que Transformam a Gestão Prisional
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1.125rem',
              maxWidth: 600,
            }}
          >
            Tecnologia de ponta para controlar cada detalhe do sistema prisional brasileiro
          </Typography>
        </Stack>

        {/* Features Grid */}
        <Grid container spacing={3}>
          {FEATURES.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: feature.color,
                    transform: 'translateY(-8px)',
                    boxShadow: `0 16px 32px ${alpha(feature.color, 0.2)}`,
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  },
                }}
              >
                {/* Background decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(feature.color, 0.12)} 0%, transparent 70%)`,
                  }}
                />

                <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(feature.color, 0.12),
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <Iconify
                      icon={feature.icon as any}
                      width={36}
                      sx={{ color: feature.color }}
                    />
                  </Box>

                  {/* Content */}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: 'text.primary',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

