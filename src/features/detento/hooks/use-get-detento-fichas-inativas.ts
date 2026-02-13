import { useQuery, queryOptions } from '@tanstack/react-query';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const getFichasInativasOptions = (detentoId: string) =>
  queryOptions({
    queryKey: detentoKeys.fichasCadastraisInativas(detentoId),
    queryFn: () => detentoService.getFichasCadastraisInativas(detentoId),
    staleTime: 5 * 60 * 1000,
  });

export const useGetDetentoFichasInativas = (detentoId: string, options?: { enabled?: boolean }) =>
  useQuery({
    ...getFichasInativasOptions(detentoId),
    enabled: options?.enabled ?? true,
  });
