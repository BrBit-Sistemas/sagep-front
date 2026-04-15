import type { EmpresaConvenioListParams } from '../types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioService } from '../data';

export const listEmpresaConvenioQueryOptions = (params: EmpresaConvenioListParams) =>
  queryOptions({
    queryKey: empresaConvenioKeys.list(params),
    queryFn: () => empresaConvenioService.paginate(params),
  });

export const useEmpresaConvenioList = (params: EmpresaConvenioListParams) =>
  useQuery(listEmpresaConvenioQueryOptions(params));
