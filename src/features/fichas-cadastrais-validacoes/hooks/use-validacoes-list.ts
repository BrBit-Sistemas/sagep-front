import type { ValidacoesListParams } from '../types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

export const listValidacoesQueryOptions = (params: ValidacoesListParams) =>
  queryOptions({
    queryKey: validacoesKeys.list(params),
    queryFn: () => validacoesService.paginate(params),
    retry: false,
    staleTime: 15_000,
  });

export const useValidacoesList = (params: ValidacoesListParams) =>
  useQuery(listValidacoesQueryOptions(params));
