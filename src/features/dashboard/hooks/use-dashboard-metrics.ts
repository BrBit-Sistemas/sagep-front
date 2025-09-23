import { useQuery, queryOptions } from '@tanstack/react-query';

import { dashboardKeys } from './keys';
import { dashboardService } from '../data';

export const dashboardMetricsQueryOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.metrics(),
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 5 * 60 * 1000,
  });

export const useDashboardMetrics = () => useQuery(dashboardMetricsQueryOptions());
