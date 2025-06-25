import type { DetentoListParams } from '../types';

import { useQuery } from '@tanstack/react-query';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const useDetentoList = (params: DetentoListParams) =>
  useQuery({
    queryKey: detentoKeys.list(params),
    queryFn: () => detentoService.list(params),
  });
