import type { ProfissaoListParams } from 'src/features/profissoes/types';

import { useQuery } from '@tanstack/react-query';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const useListProfissoes = (params: ProfissaoListParams) =>
  useQuery({
    queryKey: profissaoKeys.list(params),
    queryFn: () => profissaoService.paginate(params),
  });
