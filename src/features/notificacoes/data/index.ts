import type {
  Notificacao,
  NotificacaoPaginada,
  MarkAllAsReadResponse,
  NotificacaoListParams,
  UnreadNotificacaoCount,
} from '../types';

import { customInstance } from 'src/lib/axios';

export const notificacaoService = {
  list: ({ page = 0, limit = 20 }: NotificacaoListParams = {}) =>
    customInstance<NotificacaoPaginada>({
      url: '/notificacoes',
      method: 'GET',
      params: { page, limit },
    }),

  unreadCount: () =>
    customInstance<UnreadNotificacaoCount>({
      url: '/notificacoes/unread-count',
      method: 'GET',
    }),

  markAsRead: (id: string) =>
    customInstance<Notificacao>({
      url: `/notificacoes/${id}/read`,
      method: 'PATCH',
    }),

  markAllAsRead: () =>
    customInstance<MarkAllAsReadResponse>({
      url: '/notificacoes/read-all',
      method: 'PATCH',
    }),
};
