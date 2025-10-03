import type { Theme, SxProps } from '@mui/material/styles';

import { useQuery } from '@tanstack/react-query';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';
import { getAutenticação } from 'src/api/autenticação/autenticação';

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  required?: { action: string; subject: string } | { action: string; subject: string }[];
  hasContent?: boolean;
  sx?: SxProps<Theme>;
};

const authApi = getAutenticação();

export function PermissionGuard({
  children,
  requireAdmin = false,
  required,
  hasContent = true,
  sx,
}: Props) {
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });

  if (isLoading) return null;

  const isAdmin = Boolean((me as any)?.isAdmin);

  const hasPermission = (req: { action: string; subject: string }) =>
    Boolean(
      (me as any)?.roles?.some((role: any) =>
        role?.permissions?.some(
          (perm: any) => perm?.action === req.action && perm?.subject === req.subject
        )
      )
    );

  const hasAnyRequiredPermission = Array.isArray(required)
    ? required.some((r) => hasPermission(r))
    : required
      ? hasPermission(required)
      : true;

  const allowed = (requireAdmin ? isAdmin : true) && hasAnyRequiredPermission;

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

// Reusable hook for checking permissions in components (e.g., to hide/show columns/actions)
export function usePermissionCheck() {
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });

  const isAdmin = Boolean((me as any)?.isAdmin);

  const hasPermission = (req: { action: string; subject: string }) =>
    Boolean(
      (me as any)?.roles?.some((role: any) =>
        role?.permissions?.some(
          (perm: any) => perm?.action === req.action && perm?.subject === req.subject
        )
      )
    );

  const hasAny = (
    required?: { action: string; subject: string } | { action: string; subject: string }[]
  ) => {
    if (!required) return true;
    return Array.isArray(required)
      ? required.some((r) => hasPermission(r))
      : hasPermission(required);
  };

  return { isLoading, isAdmin, hasPermission, hasAny } as const;
}
