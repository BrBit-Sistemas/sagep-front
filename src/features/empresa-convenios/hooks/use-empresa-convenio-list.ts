import type { PaginatedParams } from 'src/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioService } from '../data';

export const listEmpresaConvenioQueryOptions = (params: PaginatedParams) =>
  queryOptions({
    queryKey: empresaConvenioKeys.list(params),
    queryFn: () => empresaConvenioService.paginate(params),
  });

export const useEmpresaConvenioList = (params: PaginatedParams) =>
  useQuery(listEmpresaConvenioQueryOptions(params));
