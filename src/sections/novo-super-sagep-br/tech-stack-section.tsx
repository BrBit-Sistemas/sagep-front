import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TECH_STACK = [
  {
    icon: 'devicon:nestjs',
    title: 'NestJS',
    description: 'Framework backend enterprise com TypeScript',
    category: 'Backend',
  },
  {
    icon: 'devicon:react',
    title: 'React 18',
    description: 'Frontend moderno com hooks e performance',
    category: 'Frontend',
  },
  {
    icon: 'devicon:typescript',
    title: 'TypeScript',
    description: 'Type-safety em todo código base',
    category: 'Language',
  },
  {
    icon: 'devicon:postgresql',
    title: 'PostgreSQL',
    description: 'Banco de dados relacional robusto',
    category: 'Database',
  },
  {
    icon: 'devicon:redis',
    title: 'Redis',
    description: 'Cache de alta performance',
    category: 'Cache',
  },
  {
    icon: 'devicon:docker',
    title: 'Docker',
    description: 'Containerização e deploy',
    category: 'DevOps',
  },
];

const BENEFITS = [
  {
    icon: 'solar:bolt-circle-bold',
    title: 'Performance Otimizada',
    description: 'Cache inteligente e queries otimizadas para respostas instantâneas',
  },
  {
    icon: 'solar:shield-check-bold',
    title: 'Segurança Enterprise',
    description: 'Autenticação JWT, RBAC, auditoria completa e conformidade LGPD',
  },
  {
    icon: 'solar:chart-2-bold',
    title: 'Escalabilidade',
    description: 'Arquitetura preparada para crescer de 1 a 1000+ unidades prisionais',
  },
];

export function TechStackSection() {
  const theme = useTheme();

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
          Tecnologia de Ponta
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.75rem' },
            fontWeight: 800,
            maxWidth: 700,
          }}
        >
          Construído com as Melhores Tecnologias
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '1.125rem',
            maxWidth: 700,
          }}
        >
          Performance, segurança e escalabilidade não são acidente. São resultado de escolhas técnicas inteligentes.
        </Typography>
      </Stack>

      {/* Tech Stack Grid */}
      <Grid container spacing={2}>
        {TECH_STACK.map((tech, index) => (
          <Grid key={index} size={{ xs: 6, sm: 4, md: 2 }}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: (t) => `0 8px 16px ${alpha(t.palette.primary.main, 0.12)}`,
                },
              }}
            >
              <Iconify icon={tech.icon as any} width={48} sx={{ mb: 2 }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                {tech.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {tech.category}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Benefits */}
      <Grid container spacing={3}>
        {BENEFITS.map((benefit, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  flexShrink: 0,
                }}
              >
                <Iconify
                  icon={benefit.icon as any}
                  width={24}
                  sx={{ color: 'primary.main' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {benefit.description}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

