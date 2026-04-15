import { useQuery, queryOptions } from '@tanstack/react-query';

import { getDetentos } from 'src/api/detentos/detentos';

import { detentoKeys } from './keys';

const api = getDetentos();

export const detentoIndicadoresQueryOptions = () =>
  queryOptions({
    queryKey: [...detentoKeys.all, 'indicadores-validacao'] as const,
    queryFn: () => api.indicadoresValidacao(),
    retry: false,
    staleTime: 30_000,
  });

export const useDetentoIndicadores = () => useQuery(detentoIndicadoresQueryOptions());
