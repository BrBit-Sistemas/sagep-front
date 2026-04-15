import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaKeys } from './keys';
import { empresaMetrics } from '../data';

export const empresaMetricsQueryOptions = () =>
  queryOptions({
    queryKey: empresaKeys.metrics(),
    queryFn: () => empresaMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useEmpresaMetrics = () => useQuery(empresaMetricsQueryOptions());
