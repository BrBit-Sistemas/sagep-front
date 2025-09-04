import type { AuditableEntity } from 'src/types';

export type ModalidadeExecucao = 'INTRAMUROS' | 'EXTRAMUROS';
export type StatusConvenio = 'RASCUNHO' | 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';

export type EmpresaConvenio = {
  convenio_id: string;
  empresa_id: string;
  tipo_codigo: string;
  modalidade_execucao: ModalidadeExecucao;
  regimes_permitidos: number[];
  artigos_vedados: number[];
  quantitativo_maximo?: number | null;
  data_inicio: string; // YYYY-MM-DD
  data_fim?: string | null; // YYYY-MM-DD
  status: StatusConvenio;
  observacoes?: string;
} & AuditableEntity;

export type EmpresaConvenioListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: StatusConvenio;
};

