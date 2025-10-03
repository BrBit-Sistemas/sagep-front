import { getDashboard } from 'src/api/dashboard/dashboard';

const dashboardApi = getDashboard();

export const dashboardService = {
  getMetrics: () => dashboardApi.metrics(),
};

export type DashboardMetrics = Awaited<ReturnType<typeof dashboardService.getMetrics>>;
