import { useQuery, queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const getFichasCadastraisOptions = (detentoId: string) =>
  queryOptions({
    queryKey: detentoKeys.fichasCadastrais(detentoId),
    queryFn: () => detentoService.getFichasCadastrais(detentoId),
  });

export const useGetDetentoFichasCadastrais = (detentoId: string) =>
  useQuery(getFichasCadastraisOptions(detentoId));

export const useSuspenseGetDetentoFichasCadastrais = (detentoId: string) =>
  useSuspenseQuery(getFichasCadastraisOptions(detentoId));
