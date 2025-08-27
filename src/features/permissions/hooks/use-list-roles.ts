import type { PaginatedParams } from 'src/types';

import { useQuery } from '@tanstack/react-query';

import { roleService } from '../data';
import { permissionsKeys } from './keys';

export const useListRoles = (params: PaginatedParams) =>
  useQuery({
    queryKey: permissionsKeys.rolesList(params),
    queryFn: () => roleService.paginate(params),
  });
