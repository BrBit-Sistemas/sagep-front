import type { FichasCadastraisListParams } from '../types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { fichasCadastraisKeys } from './keys';
import { fichasCadastraisService } from '../data';

export const listFichasCadastraisQueryOptions = (params: FichasCadastraisListParams) =>
  queryOptions({
    queryKey: fichasCadastraisKeys.list(params),
    queryFn: () => fichasCadastraisService.paginate(params),
    retry: false,
    staleTime: 15_000,
  });

export const useFichasCadastraisList = (params: FichasCadastraisListParams) =>
  useQuery(listFichasCadastraisQueryOptions(params));
