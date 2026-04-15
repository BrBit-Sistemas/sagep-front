import type { DetentoListParams } from '../types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const listDetentoQueryOptions = (params: DetentoListParams) =>
  queryOptions({
    queryKey: detentoKeys.list(params),
    queryFn: () => detentoService.paginate(params),
  });

export const useDetentoList = (params: DetentoListParams) =>
  useQuery(listDetentoQueryOptions(params));
