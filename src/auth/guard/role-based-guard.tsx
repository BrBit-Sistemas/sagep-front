import type { Theme, SxProps } from '@mui/material/styles';

import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from 'src/routes/hooks';

import { getAutenticação } from 'src/api/autenticação/autenticação';

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
  const router = useRouter();
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

  const isAdmin = Boolean(me?.isAdmin);

  const hasPermission = (token: string) => {
    if (isAdmin) return true;

    const [action, subject] = token.split(':');

    if (!action || !subject) return false;

    if (!me || !me.roles) return false;

    return Boolean(
      me.roles.some((role: any) =>
        role?.permissions?.some((perm: any) => perm?.action === action && perm?.subject === subject)
      )
    );
  };

  const canAccess = shouldCheckPermissions ? tokens.some((token) => hasPermission(token)) : true;

  useEffect(() => {
    if (shouldCheckPermissions && !isLoading && !canAccess && hasContent) {
      router.replace('/401');
    }
  }, [shouldCheckPermissions, isLoading, canAccess, hasContent, router]);

  if (!shouldCheckPermissions) {
    return <>{children}</>;
  }

  if (isLoading) {
    return null;
  }

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
}
