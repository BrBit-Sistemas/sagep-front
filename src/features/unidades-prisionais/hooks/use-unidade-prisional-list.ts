import type { UnidadePrisionalListParams } from 'src/features/unidades-prisionais/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { unidadePrisionalKeys } from './keys';
import { unidadePrisionalService } from '../data';

export const listUnidadePrisionalQueryOptions = (params: UnidadePrisionalListParams) =>
  queryOptions({
    queryKey: unidadePrisionalKeys.list(params),
    queryFn: () => unidadePrisionalService.paginate(params),
  });

export const useUnidadePrisionalList = (params: UnidadePrisionalListParams) =>
  useQuery(listUnidadePrisionalQueryOptions(params));
