import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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
    <>
      <Box
        sx={{
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.dark, 0.95)} 0%, 
            ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
          py: 15,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ color: 'white', mb: 2 }}>
            Case de Sucesso: FUNAP-DF
          </Typography>
          
          <Typography variant="h5" sx={{ color: 'grey.300', mb: 4, fontWeight: 400 }}>
            Sistema em produção alocando reeducandos com 96% mais agilidade.
            Conheça a solução que está transformando a ressocialização no Brasil.
          </Typography>
          
          <Stack 
            direction={{ md: 'row', xs: 'column' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              size="large"
              variant="contained"
              color="warning"
              href="/sagep-docs/documentacao"
              startIcon={<Iconify icon="solar:document-text-bold" {...({} as any)} />}
              sx={{ minWidth: 220 }}
            >
              Ver Documentação Técnica
            </Button>
            
            <Button
              size="large"
              variant="outlined"
              href="/"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                minWidth: 220,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                },
              }}
              startIcon={<Iconify icon="solar:home-angle-bold" {...({} as any)} />}
            >
              Voltar ao Sistema
            </Button>
          </Stack>
          
          <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 6 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>E-mail</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>funap@sejus.df.gov.br</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>Telefone</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>(61) 3686-5000</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>Horário</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Segunda a Sexta, 8h às 18h</Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.neutral', py: 4 }}>
        <Container>
          <Stack direction={{ md: 'row', xs: 'column' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              © 2025 SAGEP - Sistema de Alocação e Gestão de Reeducandos • FUNAP-DF
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="/" variant="body2" color="text.secondary">Voltar ao Sistema</Link>
              <Link href="#" variant="body2" color="text.secondary">Suporte</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

