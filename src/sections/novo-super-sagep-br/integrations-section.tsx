import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const INTEGRATIONS = [
  {
    icon: 'solar:shield-check-bold',
    title: 'CNJ - SEEU',
    description: 'Envio automático de ofícios e petições',
    status: 'ready',
    color: '#0EA5E9',
  },
  {
    icon: 'solar:chart-2-bold',
    title: 'CNJ - GEOPRESÍDIOS',
    description: 'Relatórios e dados nacionais',
    status: 'ready',
    color: '#8B5CF6',
  },
  {
    icon: 'solar:chart-square-bold',
    title: 'INFOPEN',
    description: 'Sistema de informações penitenciárias',
    status: 'ready',
    color: '#10B981',
  },
  {
    icon: 'solar:wallet-money-bold',
    title: 'Bancos',
    description: 'Pagamento de pecúlio automatizado',
    status: 'ready',
    color: '#F59E0B',
  },
  {
    icon: 'solar:document-text-bold',
    title: 'Tribunais (e-SAJ, PJe)',
    description: 'Integração com sistemas judiciais',
    status: 'development',
    color: '#EC4899',
  },
  {
    icon: 'solar:hand-heart-bold',
    title: 'INSS',
    description: 'Auxílio reclusão e benefícios',
    status: 'development',
    color: '#06B6D4',
  },
  {
    icon: 'solar:user-id-bold',
    title: 'Receita Federal',
    description: 'Validação de CPF e documentos',
    status: 'development',
    color: '#EF4444',
  },
  {
    icon: 'solar:car-bold',
    title: 'DETRAN',
    description: 'Consulta de documentação',
    status: 'planned',
    color: '#64748B',
  },
];

const STATUS_CONFIG = {
  ready: {
    label: 'Disponível',
    color: '#10B981',
    bgcolor: alpha('#10B981', 0.12),
  },
  development: {
    label: 'Em Desenvolvimento',
    color: '#F59E0B',
    bgcolor: alpha('#F59E0B', 0.12),
  },
  planned: {
    label: 'Planejado',
    color: '#6B7280',
    bgcolor: alpha('#6B7280', 0.12),
  },
};

export function IntegrationsSection() {
  const theme = useTheme();

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
              Integrações Nacionais
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                maxWidth: 700,
              }}
            >
              Conectado aos Principais Sistemas
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.125rem',
                maxWidth: 700,
              }}
            >
              Integrações oficiais com órgãos governamentais e instituições financeiras para automação completa
            </Typography>
          </Stack>

          {/* Integrations Grid */}
          <Grid container spacing={3}>
            {INTEGRATIONS.map((integration, index) => {
              const statusConfig = STATUS_CONFIG[integration.status as keyof typeof STATUS_CONFIG];
              
              return (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
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
                        borderColor: integration.color,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 24px ${alpha(integration.color, 0.15)}`,
                      },
                    }}
                  >
                    {/* Background decoration */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(integration.color, 0.12)} 0%, transparent 70%)`,
                      }}
                    />

                    <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                      {/* Status Badge */}
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: statusConfig.bgcolor,
                          width: 'fit-content',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: statusConfig.color,
                            fontWeight: 700,
                            fontSize: '0.6875rem',
                          }}
                        >
                          {statusConfig.label}
                        </Typography>
                      </Box>

                      {/* Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(integration.color, 0.12),
                        }}
                      >
                        <Iconify
                          icon={integration.icon as any}
                          width={24}
                          sx={{ color: integration.color }}
                        />
                      </Box>

                      {/* Title */}
                      <Typography variant="subtitle1" fontWeight={700}>
                        {integration.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6,
                          minHeight: 40,
                        }}
                      >
                        {integration.description}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Bottom Info */}
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.dark, 0.12)} 100%)`,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.16),
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.16),
                  }}
                >
                  <Iconify
                    icon={"solar:cpu-bolt-bold" as any}
                    width={32}
                    sx={{ color: 'primary.main' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    Novas Integrações em Desenvolvimento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estamos constantemente expandindo nossas integrações para oferecer mais automação
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

