import type { UserListParams } from 'src/features/users/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { userService } from 'src/features/users/data';

import { userKeys } from './keys';

export const listUsersQueryOptions = (params: UserListParams) =>
  queryOptions({
    queryKey: userKeys.list(params),
    queryFn: () => userService.paginate(params),
  });

export const useUserList = (params: UserListParams) => useQuery(listUsersQueryOptions(params));
