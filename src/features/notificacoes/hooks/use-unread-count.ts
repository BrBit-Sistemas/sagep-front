import { useQuery, queryOptions } from '@tanstack/react-query';

import { notificacaoKeys } from './keys';
import { notificacaoService } from '../data';

export const unreadNotificacoesCountQueryOptions = () =>
  queryOptions({
    queryKey: notificacaoKeys.unreadCount(),
    queryFn: () => notificacaoService.unreadCount(),
    refetchInterval: 30000,
  });

export const useUnreadCount = () =>
  useQuery(unreadNotificacoesCountQueryOptions());
