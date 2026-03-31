import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioService } from '../data';

export const empresaConvenioDetailQueryOptions = (convenioId: string) =>
  queryOptions({
    queryKey: empresaConvenioKeys.detail(convenioId),
    queryFn: () => empresaConvenioService.read(convenioId),
  });

export const useEmpresaConvenioDetail = (convenioId: string | undefined) =>
  useQuery({
    ...empresaConvenioDetailQueryOptions(convenioId!),
    enabled: !!convenioId,
  });
