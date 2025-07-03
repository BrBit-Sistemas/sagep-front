import type { PaginatedParams } from 'src/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const listDetentoQueryOptions = (params: PaginatedParams) =>
  queryOptions({
    queryKey: detentoKeys.list(params),
    queryFn: () => detentoService.paginate(params),
  });

export const useDetentoList = (params: PaginatedParams) =>
  useQuery(listDetentoQueryOptions(params));
