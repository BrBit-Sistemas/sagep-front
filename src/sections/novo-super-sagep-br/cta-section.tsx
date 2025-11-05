import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CtaSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
          background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center' }}>
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#fff', 0.12),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Iconify
              icon={"solar:rocket-bold-duotone" as any}
              width={40}
              sx={{ color: 'common.white' }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              color: 'common.white',
              maxWidth: 800,
              lineHeight: 1.3,
            }}
          >
            Pronto para Revolucionar a Gestão Prisional?
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.85),
              maxWidth: 700,
              fontWeight: 400,
              fontSize: { xs: '1.125rem', md: '1.25rem' },
            }}
          >
            Junte-se ao futuro da gestão prisional brasileira. Sistema único, nacional e completo.
          </Typography>

          {/* Key Points */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              pt: 2,
            }}
          >
            {[
              { icon: 'solar:check-circle-bold', text: 'Implantação Gratuita' },
              { icon: 'solar:shield-check-bold', text: 'Suporte 24/7' },
              { icon: 'solar:star-bold', text: 'Treinamento Incluído' },
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
                  bgcolor: alpha('#fff', 0.12),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Iconify
                  icon={item.icon as any}
                  width={20}
                  sx={{ color: 'common.white' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'common.white',
                    fontWeight: 600,
                  }}
                >
                  {item.text}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              size="large"
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon={"solar:calendar-date-bold" as any} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                bgcolor: 'common.white',
                color: 'primary.main',
                boxShadow: `0 8px 24px ${alpha('#000', 0.2)}`,
                '&:hover': {
                  bgcolor: alpha('#fff', 0.95),
                  boxShadow: `0 12px 32px ${alpha('#000', 0.3)}`,
                },
              }}
            >
              Agendar Demonstração
            </Button>
            <Button
              size="large"
              variant="outlined"
              startIcon={<Iconify icon={"solar:chat-round-dots-bold" as any} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderColor: alpha('#fff', 0.5),
                color: 'common.white',
                '&:hover': {
                  borderColor: 'common.white',
                  bgcolor: alpha('#fff', 0.08),
                },
              }}
            >
              Falar com Especialista
            </Button>
          </Stack>

          {/* Footer note */}
          <Typography
            variant="caption"
            sx={{
              color: alpha('#fff', 0.7),
              pt: 2,
              maxWidth: 500,
            }}
          >
            Sistema desenvolvido em parceria com especialistas do sistema prisional brasileiro.
            Adequado às normas do CNJ e legislação penitenciária.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

