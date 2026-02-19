import type { NotificacaoListParams } from '../types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { notificacaoKeys } from './keys';
import { notificacaoService } from '../data';

export const notificacoesQueryOptions = (
  params: NotificacaoListParams = {},
) =>
  queryOptions({
    queryKey: notificacaoKeys.list(params),
    queryFn: () => notificacaoService.list(params),
    refetchInterval: 30000,
  });

export const useNotificacoes = (params: NotificacaoListParams = {}) =>
  useQuery(notificacoesQueryOptions(params));
