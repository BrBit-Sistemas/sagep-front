import { useQuery, queryOptions } from '@tanstack/react-query';

import { fichasCadastraisKeys } from './keys';
import { fichasCadastraisService } from '../data';

export const fichasCadastraisMetricsQueryOptions = () =>
  queryOptions({
    queryKey: fichasCadastraisKeys.metrics(),
    queryFn: () => fichasCadastraisService.metrics(),
    retry: false,
    staleTime: 30_000,
  });

export const useFichasCadastraisMetrics = () => useQuery(fichasCadastraisMetricsQueryOptions());
