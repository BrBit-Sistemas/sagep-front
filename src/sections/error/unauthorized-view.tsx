import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function UnauthorizedView() {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <Container component={MotionContainer}>
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Acesso não autorizado
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            Você não possui permissão para acessar esta página. Entre em contato com o administrador
            se acredita que isso é um erro.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/dashboard" size="large" variant="contained">
          Voltar ao Dashboard
        </Button>
      </Container>
    </SimpleLayout>
  );
}
