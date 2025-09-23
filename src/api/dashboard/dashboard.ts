import { customInstance } from 'src/lib/axios';

export interface DashboardConvenioStatusDto {
  status: string;
  total: number;
}

export interface DashboardMetricsDto {
  totalReeducandosAtivos: number;
  totalEmpresasAtivas: number;
  conveniosPorStatus: DashboardConvenioStatusDto[];
}

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getDashboard = () => {
  const metrics = (options?: SecondParameter<typeof customInstance>) =>
    customInstance<DashboardMetricsDto>({ url: `/dashboard/metrics`, method: 'GET' }, options);

  return { metrics };
};

export type FetchMetricsResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getDashboard>['metrics']>>
>;
