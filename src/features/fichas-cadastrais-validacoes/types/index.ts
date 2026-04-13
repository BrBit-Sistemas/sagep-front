import type { AuditableEntity } from 'src/types';

export type ValidacaoStatus = 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'ALERTA';

export type RegimePrisional = 'FECHADO' | 'SEMIABERTO' | 'ABERTO' | 'PROVISORIO' | 'OUTRO';

export type FichaCadastralValidacao = {
  /** MUI DataGrid row id (mirror de ficha_cadastral_id). */
  id: string;
  ficha_cadastral_id: string;

  /** Dados do reeducando (flatten vindo do back-end). */
  detento_id: string;
  detento_nome: string;
  matricula: string | null;

  /** Identificação da ficha. */
  ficha_cadastral_numero: string | null;
  ficha_cadastral_status: 'ATIVA' | 'INATIVA' | string;

  /** Estado da validação. */
  status: ValidacaoStatus;
  motivo_rejeicao: string | null;

  /** Contexto de autorização para trabalho. */
  autorizacao_trabalho: boolean | null;
  regime: RegimePrisional | null;
  artigos: string[];

  /** Integrações externas checadas. */
  seeu_consultado: boolean;
  siapen_consultado: boolean;

  observacao: string | null;

  /** Metadados da última validação. */
  validado_por_id: string | null;
  validado_por_nome: string | null;
  validado_em: string | null;
} & AuditableEntity;

export type ValidacoesListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: ValidacaoStatus | '';
  motivo_rejeicao?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type ValidacoesMetrics = {
  totalAtivas: number;
  aprovadas: number;
  pendentes: number;
  alertas: number;
  reprovadas: number;
};
