import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function HeroSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 15, md: 20 },
        pb: { xs: 10, md: 15 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={5} alignItems="center" sx={{ textAlign: 'center' }}>
          {/* Badge */}
          <m.div variants={varFade('inDown', { distance: 24 })}>
            <Chip
              label="🚀 Sistema Único Nacional"
              color="primary"
              variant="soft"
              size="medium"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 2,
                py: 0.5,
              }}
            />
          </m.div>

          {/* Title */}
          <m.div variants={varFade('inDown', { distance: 24 })}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Novo Super SAGEP Brasil
            </Typography>
          </m.div>

          {/* Subtitle */}
          <m.div variants={varFade('inDown', { distance: 24 })}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                fontWeight: 500,
                color: 'text.secondary',
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              Sistema de Gestão Completo para o Sistema Prisional Brasileiro
            </Typography>
          </m.div>

          {/* Description */}
          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Eficiência • Transparência • Segurança • Controle Total
            </Typography>
          </m.div>

          {/* Key Points */}
          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ maxWidth: 900 }}
            >
              {[
                { icon: 'solar:shield-check-bold', text: 'Integração CNJ (SEEU)' },
                { icon: 'solar:users-group-rounded-bold', text: 'Gestão de 13+ Setores' },
                { icon: 'solar:chart-2-bold', text: 'BI & Dashboards' },
                { icon: 'solar:star-bold', text: 'Biometria Facial' },
              ].map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }}
                >
                  <Iconify
                    icon={item.icon as any}
                    width={20}
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {item.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </m.div>

          {/* CTA Buttons */}
          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={<Iconify icon={"solar:document-text-bold" as any} />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': {
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}`,
                  },
                }}
              >
                Ver Documentação Completa
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="primary"
                startIcon={<Iconify icon={"solar:calendar-date-bold" as any} />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Agendar Demonstração
              </Button>
            </Stack>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}

