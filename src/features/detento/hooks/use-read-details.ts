import { useQuery, queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const readDetentoDetailsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: detentoKeys.read(id),
    queryFn: () => detentoService.read(id),
  });

export const useReadDetentoDetails = (id: string) => useQuery(readDetentoDetailsQueryOptions(id));

export const useSuspenseReadDetentoDetails = (id: string) =>
  useSuspenseQuery(readDetentoDetailsQueryOptions(id));
