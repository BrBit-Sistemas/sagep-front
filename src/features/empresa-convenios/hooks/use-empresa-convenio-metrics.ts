import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioMetrics } from '../data';

export const empresaConvenioMetricsQueryOptions = () =>
  queryOptions({
    queryKey: empresaConvenioKeys.metrics(),
    queryFn: () => empresaConvenioMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useEmpresaConvenioMetrics = () => useQuery(empresaConvenioMetricsQueryOptions());
