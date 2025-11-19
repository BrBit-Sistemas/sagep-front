import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATS = [
  {
    icon: 'solar:layers-minimalistic-bold',
    value: '13+',
    label: 'Módulos Integrados',
    color: '#0EA5E9',
  },
  {
    icon: 'solar:widget-5-bold',
    value: '150+',
    label: 'Funcionalidades',
    color: '#8B5CF6',
  },
  {
    icon: 'solar:buildings-3-bold',
    value: '100%',
    label: 'Cobertura Nacional',
    color: '#10B981',
  },
  {
    icon: 'solar:shield-check-bold',
    value: '27',
    label: 'Estados Brasileiros',
    color: '#F59E0B',
  },
];

export function StatsSection() {

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {STATS.map((stat, index) => (
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
                    borderColor: stat.color,
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(stat.color, 0.15)}`,
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
                    background: `radial-gradient(circle, ${alpha(stat.color, 0.15)} 0%, transparent 70%)`,
                  }}
                />

                <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(stat.color, 0.12),
                    }}
                  >
                    <Iconify
                      icon={stat.icon as any}
                      width={32}
                      sx={{ color: stat.color }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: stat.color,
                        lineHeight: 1,
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {stat.label}
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

