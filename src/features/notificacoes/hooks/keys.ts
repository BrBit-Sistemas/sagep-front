export const notificacaoKeys = {
  all: ['notificacoes'] as const,
  list: (params: Record<string, unknown>) =>
    [...notificacaoKeys.all, 'list', params] as const,
  unreadCount: () => [...notificacaoKeys.all, 'unread-count'] as const,
};
