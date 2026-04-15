import { useQuery, queryOptions } from '@tanstack/react-query';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

export const validacaoDetailsQueryOptions = (fichaId: string | null) =>
  queryOptions({
    queryKey: validacoesKeys.detail(fichaId ?? ''),
    queryFn: () => validacoesService.read(fichaId as string),
    enabled: Boolean(fichaId),
  });

export const useValidacaoDetails = (fichaId: string | null) =>
  useQuery(validacaoDetailsQueryOptions(fichaId));
