import { useQuery, queryOptions } from '@tanstack/react-query';

import { profissaoKeys } from './keys';
import { profissaoMetrics } from '../data';

export const profissaoMetricsQueryOptions = () =>
  queryOptions({
    queryKey: profissaoKeys.metrics(),
    queryFn: () => profissaoMetrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useProfissaoMetrics = () => useQuery(profissaoMetricsQueryOptions());
