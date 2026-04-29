import { useQuery, queryOptions } from '@tanstack/react-query';

import { unidadePrisionalKeys } from './keys';
import { unidadePrisionalMetrics } from '../data';

export const unidadePrisionalMetricsQueryOptions = () =>
  queryOptions({
    queryKey: unidadePrisionalKeys.metrics(),
    queryFn: () => unidadePrisionalMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useUnidadePrisionalMetrics = () => useQuery(unidadePrisionalMetricsQueryOptions());
