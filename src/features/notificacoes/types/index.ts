import type { PaginatedResponse } from 'src/types';

export type NotificacaoCanal = 'whatsapp' | 'email' | 'web';
export type NotificacaoStatus = 'enviado' | 'erro';

export type Notificacao = {
  id: string;
  usuarioId: string;
  tipo: string;
  canal: NotificacaoCanal;
  status: NotificacaoStatus;
  titulo?: string | null;
  mensagem: string;
  lida: boolean;
  createdAt: string;
};

export type NotificacaoListParams = {
  page?: number;
  limit?: number;
};

export type NotificacaoPaginada = PaginatedResponse<Notificacao>;

export type UnreadNotificacaoCount = {
  total: number;
};

export type MarkAllAsReadResponse = {
  totalAtualizadas: number;
};
