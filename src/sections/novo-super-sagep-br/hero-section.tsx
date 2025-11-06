import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

// Azul escuro e sofisticado do SAGEP
const SAGEP_BLUE_DARK = '#1A2B42'; // Azul navy profissional
const SAGEP_BLUE = '#1E40AF'; // Azul vibrante (para detalhes)
const SAGEP_YELLOW = '#FBBF24'; // Amarelo do logo

export function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 8 },
        background: `linear-gradient(135deg, ${SAGEP_BLUE_DARK} 0%, ${SAGEP_BLUE} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Traços fluidos orgânicos com gradiente - Saindo da tela */}
      
      {/* Traço fluido 1 - Amarelo/Branco - Top Left → Bottom Right */}
      <Box
        component={m.div}
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-20%',
          width: '70%',
          height: '130%',
          opacity: 0.7,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 500 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={SAGEP_YELLOW} stopOpacity="0.08" />
              <stop offset="50%" stopColor={SAGEP_YELLOW} stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M -50 50 Q 80 120, 150 180 Q 220 240, 180 340 Q 140 440, 250 520 Q 360 600, 420 720 L 450 800"
            stroke="url(#gradient1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M -30 80 Q 100 140, 170 200 Q 240 260, 200 360 Q 160 460, 270 540 Q 380 620, 440 740"
            stroke="url(#gradient1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </Box>

      {/* Traço fluido 2 - Branco/Amarelo - Top Right → Bottom Left */}
      <Box
        component={m.div}
        animate={{
          y: [0, 20, 0],
          x: [0, -12, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-15%',
          width: '65%',
          height: '120%',
          opacity: 0.7,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 500 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="50%" stopColor={SAGEP_YELLOW} stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path
            d="M 550 100 Q 420 160, 340 240 Q 260 320, 300 420 Q 340 520, 220 600 Q 100 680, 30 780"
            stroke="url(#gradient2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 530 130 Q 400 190, 320 270 Q 240 350, 280 450 Q 320 550, 200 630 Q 80 710, 10 810"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </Box>

      {/* Traço fluido 3 - Amarelo Diagonal - Crossing Center */}
      <Box
        component={m.div}
        animate={{
          rotate: [0, 3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        sx={{
          position: 'absolute',
          top: '15%',
          left: '-25%',
          width: '150%',
          height: '70%',
          opacity: 0.6,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={SAGEP_YELLOW} stopOpacity="0.02" />
              <stop offset="30%" stopColor={SAGEP_YELLOW} stopOpacity="0.12" />
              <stop offset="70%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M -100 250 Q 150 180, 350 220 Q 550 260, 650 240 Q 750 220, 900 280 L 1100 300"
            stroke="url(#gradient3)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M -100 280 Q 150 340, 350 300 Q 550 260, 650 280 Q 750 300, 900 240 L 1100 220"
            stroke="url(#gradient3)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </Box>

      {/* Traço fluido 4 - Branco ondulado - Bottom */}
      <Box
        component={m.div}
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '120%',
          height: '50%',
          opacity: 0.6,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 1000 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient4" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.04" />
              <stop offset="50%" stopColor={SAGEP_YELLOW} stopOpacity="0.12" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            d="M -100 300 Q 100 200, 250 250 Q 400 300, 550 220 Q 700 140, 850 240 Q 1000 340, 1100 280"
            stroke="url(#gradient4)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </Box>

      {/* Traço fluido 5 - Amarelo vertical - Right Side */}
      <Box
        component={m.div}
        animate={{
          y: [0, -30, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        sx={{
          position: 'absolute',
          top: '-5%',
          right: '-8%',
          width: '35%',
          height: '110%',
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 300 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient5" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={SAGEP_YELLOW} stopOpacity="0.03" />
              <stop offset="40%" stopColor={SAGEP_YELLOW} stopOpacity="0.15" />
              <stop offset="60%" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="100%" stopColor={SAGEP_YELLOW} stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path
            d="M 250 -50 Q 180 100, 220 250 Q 260 400, 180 550 Q 100 700, 150 800"
            stroke="url(#gradient5)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 280 -30 Q 210 120, 250 270 Q 290 420, 210 570 Q 130 720, 180 820"
            stroke="url(#gradient5)"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </Box>

      {/* Subtle texture overlay (like Retech Core) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, ${alpha('#fff', 0.02)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha('#FBBF24', 0.03)} 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      {/* Gradient orbs */}
      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#fff', 0.15)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <Box
        component={m.div}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#FBBF24', 0.2)} 0%, transparent 70%)`,
          filter: 'blur(90px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center' }}>
          {/* Badge no Topo */}
          <m.div variants={varFade('inDown', { distance: 24 })}>
            <Chip
              label="🚀 Sistema Único Nacional - Próxima Geração"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                px: 2.5,
                py: 0.5,
                height: 'auto',
                bgcolor: alpha('#fff', 0.15),
                color: '#fff',
                border: '2px solid',
                borderColor: alpha('#fff', 0.3),
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 12px ${alpha('#000', 0.2)}`,
              }}
            />
          </m.div>

          {/* Logo SAGEP (Destaque Principal!) */}
          <m.div
            variants={varFade('inUp', { distance: 24 })}
            style={{ width: '100%', maxWidth: 500 }}
          >
            <Box
              component="img"
              src="/logo/logo-full-atual.png"
              alt="SAGEP Logo"
              sx={{
                width: '100%',
                height: 'auto',
                maxWidth: { xs: 280, sm: 380, md: 450 },
                filter: 'drop-shadow(0 12px 32px rgba(0, 0, 0, 0.3))',
              }}
            />
          </m.div>

          {/* Title abaixo da Logo */}
          <m.div variants={varFade('in', { distance: 0 })}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                fontWeight: 800,
                lineHeight: 1.3,
                color: '#fff',
                letterSpacing: '-0.01em',
                maxWidth: 700,
                mx: 'auto',
                textShadow: '0 2px 16px rgba(0, 0, 0, 0.25)',
              }}
            >
              O Futuro da Gestão Prisional Brasileira
            </Typography>
          </m.div>

          {/* Subtitle */}
          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '0.9375rem', sm: '1.0625rem', md: '1.125rem' },
                fontWeight: 400,
                color: alpha('#fff', 0.85),
                maxWidth: 650,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Controle total de <Box component="span" sx={{ fontWeight: 700, color: '#FBBF24' }}>ponta a ponta</Box>:
              desde a prisão até a reinserção social.
              Eficiência, transparência e segurança em uma única plataforma nacional.
            </Typography>
          </m.div>


          {/* Key Points - Com o azul SAGEP */}
          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ maxWidth: 1000 }}
            >
              {[
                { icon: 'solar:shield-check-bold', text: 'Integração CNJ (SEEU)', emoji: '⚖️' },
                { icon: 'solar:user-id-bold', text: 'Biometria Facial IA', emoji: '🤖' },
                { icon: 'solar:chart-square-bold', text: 'BI & Governança', emoji: '📊' },
                { icon: 'solar:cloud-check-bold', text: '27 Estados', emoji: '🇧🇷' },
              ].map((item, index) => (
                <Box
                  key={index}
                  component={m.div}
                  whileHover={{ scale: 1.05, y: -2 }}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 2.5,
                    bgcolor: alpha('#fff', 0.12),
                    border: '2px solid',
                    borderColor: alpha('#fff', 0.24),
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 4px 16px ${alpha('#000', 0.15)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography fontSize="1.125rem">{item.emoji}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: '#fff',
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </m.div>


        </Stack>
      </Container>
    </Box>
  );
}

