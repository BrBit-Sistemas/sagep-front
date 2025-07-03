import type { PaginatedParams } from 'src/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const listProfissaoQueryOptions = (params: PaginatedParams) =>
  queryOptions({
    queryKey: profissaoKeys.list(params),
    queryFn: () => profissaoService.paginate(params),
  });

export const useProfissaoList = (params: PaginatedParams) =>
  useQuery(listProfissaoQueryOptions(params));
