import type { RegionalListParams } from 'src/features/regionais/types';

import { useQuery } from '@tanstack/react-query';

import { regionalKeys } from './keys';
import { regionalService } from '../data';

export const useListRegionais = (params: RegionalListParams) =>
  useQuery({
    queryKey: regionalKeys.list(params),
    queryFn: () => regionalService.paginate(params),
  });
