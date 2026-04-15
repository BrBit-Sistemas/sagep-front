import { useQuery, queryOptions } from '@tanstack/react-query';

import { secretariaKeys } from './keys';
import { secretariaMetrics } from '../data';

export const secretariaMetricsQueryOptions = () =>
  queryOptions({
    queryKey: secretariaKeys.metrics(),
    queryFn: () => secretariaMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useSecretariaMetrics = () => useQuery(secretariaMetricsQueryOptions());
