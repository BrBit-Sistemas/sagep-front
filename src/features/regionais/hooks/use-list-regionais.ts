import type { PaginatedParams } from 'src/types';

import { useQuery } from '@tanstack/react-query';

import { regionalKeys } from './keys';
import { regionalService } from '../data';

export const useListRegionais = (params: PaginatedParams) =>
  useQuery({
    queryKey: regionalKeys.list(params),
    queryFn: () => regionalService.paginate(params),
  });
