import type { Theme, SxProps } from '@mui/material/styles';

import { useMemo } from 'react';
import { m } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';
import { getAutenticação } from 'src/api/autenticação/autenticação';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export type RoleBasedGuardProps = {
  children: React.ReactNode;
  allowedRoles?: string | string[];
  hasContent?: boolean;
  sx?: SxProps<Theme>;
};

const authApi = getAutenticação();

export function RoleBasedGuard({
  children,
  allowedRoles,
  hasContent = true,
  sx,
}: RoleBasedGuardProps) {
  const tokens = useMemo(() => {
    if (!allowedRoles) return [] as string[];
    return Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  }, [allowedRoles]);

  const shouldCheckPermissions = tokens.length > 0;

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    enabled: shouldCheckPermissions,
  });

  if (!shouldCheckPermissions) {
    return <>{children}</>;
  }

  if (isLoading) {
    return null;
  }

  const isAdmin = Boolean((me as any)?.isAdmin);

  const hasPermission = (token: string) => {
    if (isAdmin) return true;

    const [action, subject] = token.split(':');

    if (!action || !subject) return false;

    return Boolean(
      (me as any)?.roles?.some((role: any) =>
        role?.permissions?.some((perm: any) => perm?.action === action && perm?.subject === subject)
      )
    );
  };

  const canAccess = tokens.some((token) => hasPermission(token));

  if (!canAccess) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Acesso negado
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            Você não possui permissão para acessar esta página.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
