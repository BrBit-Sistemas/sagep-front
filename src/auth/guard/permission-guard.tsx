import type { Theme, SxProps } from '@mui/material/styles';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from 'src/routes/hooks';

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
  const router = useRouter();
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });

  const isAdmin = Boolean(me?.isAdmin);

  const hasPermission = (req: { action: string; subject: string }) => {
    if (!me || !me.roles) return false;

    return Boolean(
      me.roles.some((role: any) =>
        role?.permissions?.some(
          (perm: any) => perm?.action === req.action && perm?.subject === req.subject
        )
      )
    );
  };

  const hasAnyRequiredPermission = Array.isArray(required)
    ? required.some((r) => hasPermission(r))
    : required
      ? hasPermission(required)
      : true;

  const allowed = isAdmin || ((requireAdmin ? isAdmin : true) && hasAnyRequiredPermission);

  useEffect(() => {
    if (!isLoading && !allowed && hasContent) {
      router.replace('/401');
    }
  }, [isLoading, allowed, hasContent, router]);

  if (isLoading) return null;

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

export default PermissionGuard;

// Reusable hook for checking permissions in components (e.g., to hide/show columns/actions)
export function usePermissionCheck() {
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });

  const isAdmin = Boolean(me?.isAdmin);

  const hasPermission = (req: { action: string; subject: string }) => {
    if (!me || !me.roles) return false;

    return Boolean(
      me.roles.some((role: any) =>
        role?.permissions?.some(
          (perm: any) => perm?.action === req.action && perm?.subject === req.subject
        )
      )
    );
  };

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
