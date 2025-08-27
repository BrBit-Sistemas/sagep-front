import type { Theme, SxProps } from '@mui/material/styles';

import { useQuery } from '@tanstack/react-query';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';
import { getAutenticação } from 'src/api/autenticação/autenticação';

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  hasContent?: boolean;
  sx?: SxProps<Theme>;
};

const authApi = getAutenticação();

export function PermissionGuard({ children, requireAdmin = false, hasContent = true, sx }: Props) {
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });

  if (isLoading) return null;

  const allowed = requireAdmin ? Boolean((me as any)?.isAdmin) : true;

  if (!allowed) {
    return hasContent ? (
      <Container
        sx={[
          {
            display: 'flex',
            minHeight: '100vh',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            py: 6,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Acesso negado
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Você não possui permissão para acessar esta página.
        </Typography>
        <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </Container>
    ) : null;
  }

  return <>{children}</>;
}

export default PermissionGuard;
