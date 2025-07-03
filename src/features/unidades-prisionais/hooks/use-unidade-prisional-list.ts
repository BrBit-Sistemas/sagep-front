import type { PaginatedParams } from 'src/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { unidadePrisionalKeys } from './keys';
import { unidadePrisionalService } from '../data';

export const listUnidadePrisionalQueryOptions = (params: PaginatedParams) =>
  queryOptions({
    queryKey: unidadePrisionalKeys.list(params),
    queryFn: () => unidadePrisionalService.paginate(params),
  });

export const useUnidadePrisionalList = (params: PaginatedParams) =>
  useQuery(listUnidadePrisionalQueryOptions(params));
