import type { PaginatedParams } from 'src/types';

import { useQuery } from '@tanstack/react-query';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const useListProfissoes = (params: PaginatedParams) =>
  useQuery({
    queryKey: profissaoKeys.list(params),
    queryFn: () => profissaoService.paginate(params),
  });
