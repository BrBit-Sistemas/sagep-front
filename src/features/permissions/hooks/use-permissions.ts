import { useQuery } from '@tanstack/react-query';

import { getPermissionsApi } from 'src/api/permissions/permissions';

import { permissionsKeys } from './keys';

const api = getPermissionsApi();

export const usePermissions = () =>
  useQuery({
    queryKey: permissionsKeys.list(),
    queryFn: () => api.listPermissions().then((r) => r),
  });
