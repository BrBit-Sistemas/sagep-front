import { useQuery, queryOptions } from '@tanstack/react-query';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

export const validacoesMetricsQueryOptions = () =>
  queryOptions({
    queryKey: validacoesKeys.metrics(),
    queryFn: () => validacoesService.metrics(),
    staleTime: 30_000,
  });

export const useValidacoesMetrics = () => useQuery(validacoesMetricsQueryOptions());
