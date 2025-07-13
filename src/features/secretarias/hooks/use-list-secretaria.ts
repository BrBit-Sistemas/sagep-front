import type { PaginatedParams } from 'src/types';

import { useQuery } from '@tanstack/react-query';

import { secretariaKeys } from './keys';
import { secretariaService } from '../data';

export const useListSecretarias = (params: PaginatedParams) =>
  useQuery({
    queryKey: secretariaKeys.list(params),
    queryFn: () => secretariaService.paginate(params),
  });
