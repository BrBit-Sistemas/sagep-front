import { useQuery, queryOptions } from '@tanstack/react-query';

import { regionalKeys } from './keys';
import { regionalMetrics } from '../data';

export const regionalMetricsQueryOptions = () =>
  queryOptions({
    queryKey: regionalKeys.metrics(),
    queryFn: () => regionalMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useRegionalMetrics = () => useQuery(regionalMetricsQueryOptions());
