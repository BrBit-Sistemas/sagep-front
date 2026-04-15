import { useQuery, queryOptions } from '@tanstack/react-query';

import { userKeys } from './keys';
import { usuarioMetrics } from '../data';

export const userMetricsQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.metrics(),
    queryFn: () => usuarioMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useUserMetrics = () => useQuery(userMetricsQueryOptions());
