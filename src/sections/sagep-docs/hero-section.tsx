import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function HeroSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.9)} 0%, 
          ${alpha(theme.palette.primary.dark, 0.95)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ md: 7, xs: 12 }}>
            {/* Badge */}
            <Chip 
              label="🎯 Sistema Inteligente de Alocação"
              color="white"
              sx={{ mb: 2 }}
            />
            
            {/* Título principal */}
            <Typography variant="h1" sx={{ mb: 3, color: 'white' }}>
              SAGEP
              <Typography component="span" variant="h1" sx={{ color: 'warning.main' }}>
                .
              </Typography>
            </Typography>
            
            <Typography variant="h3" sx={{ mb: 2, color: 'grey.300' }}>
              Sistema de Alocação e Gestão de Reeducandos
            </Typography>
            
            {/* Subtítulo */}
            <Typography variant="h5" sx={{ mb: 4, color: 'grey.400', fontWeight: 400 }}>
              Matching inteligente entre reeducandos e vagas de trabalho
              com algoritmo de compatibilidade baseado em IA
            </Typography>
            
            {/* Estatísticas rápidas */}
            <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h2" sx={{ color: 'warning.main' }}>
                  850mil
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                  Pessoas no Sistema Prisional BR
                </Typography>
              </Box>
              <Box>
                <Typography variant="h2" sx={{ color: 'success.main' }}>
                  70%
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                  ↓ Reincidência com Trabalho
                </Typography>
              </Box>
              <Box>
                <Typography variant="h2" sx={{ color: 'info.main' }}>
                  5min
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                  vs 2h Manual
                </Typography>
              </Box>
            </Stack>
            
            {/* CTAs */}
            <Stack direction="row" spacing={2}>
              <Button 
                size="large" 
                variant="contained" 
                color="warning"
                startIcon={<Iconify icon="solar:eye-bold" />}
                href="#demo"
              >
                Ver Demonstração
              </Button>
              <Button 
                size="large" 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'white' }}
                startIcon={<Iconify icon="solar:file-text-bold" />}
                href="#como-funciona"
              >
                Documentação
              </Button>
            </Stack>
          </Grid>
          
          <Grid size={{ md: 5, xs: 12 }}>
            {/* Ilustração Visual Impactante */}
            <Box
              sx={{
                width: '100%',
                height: 400,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Círculos de fundo animados */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.3 },
                  },
                  animation: 'pulse 3s ease-in-out infinite',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.info.main, 0.15),
                  animation: 'pulse 3s ease-in-out infinite 0.5s',
                }}
              />
              
              {/* Container central */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  backdropFilter: 'blur(20px)',
                  border: `3px solid ${alpha(theme.palette.warning.main, 0.5)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.3)}`,
                }}
              >
                {/* Ícone principal */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.4)}`,
                  }}
                >
                  <Iconify icon="solar:graph-new-bold" width={48} sx={{ color: 'white' }} {...({} as any)} />
                </Box>
                
                {/* Texto */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  IA
                  <Typography component="span" sx={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'grey.400' }}>
                    Matching
                  </Typography>
                </Typography>
              </Box>
              
              {/* Chips flutuantes ao redor */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 40,
                  right: 20,
                  '@keyframes float1': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                  },
                  animation: 'float1 4s ease-in-out infinite',
                }}
              >
                <Chip 
                  label="92% precisão" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.9),
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
                  }} 
                />
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 60,
                  left: 10,
                  animation: 'float1 4s ease-in-out infinite 1s',
                }}
              >
                <Chip 
                  label="5 min" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.9),
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.4)}`
                  }} 
                />
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 100,
                  right: 40,
                  animation: 'float1 4s ease-in-out infinite 2s',
                }}
              >
                <Chip 
                  label="100% auto" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.9),
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.4)}`
                  }} 
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          animation: 'bounce 2s infinite',
        }}
      >
        <Iconify icon="solar:alt-arrow-down-outline" width={32} sx={{ color: 'white' }} {...({} as any)} />
      </Box>
    </Box>
  );
}

