import type { AuditableEntity } from 'src/types';

export type ModalidadeExecucao = 'INTRAMUROS' | 'EXTRAMUROS';
export type StatusConvenio = 'RASCUNHO' | 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';

export type EmpresaConvenioLocal = {
  local_id: string;
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade: string;
  estado: string;
  cep?: string | null;
  referencia?: string | null;
};

export type EmpresaConvenio = {
  id: string; // Campo necessário para MUI DataGrid
  convenio_id: string;
  empresa_id: string;
  tipo_codigo: string;
  modalidade_execucao: ModalidadeExecucao;
  regimes_permitidos: number[];
  artigos_vedados: number[];
  quantitativos_profissoes?: { profissao_id: string; quantidade: number }[];
  data_inicio: string; // YYYY-MM-DD
  data_fim?: string | null; // YYYY-MM-DD
  status: StatusConvenio;
  observacoes?: string;
  locais_execucao?: EmpresaConvenioLocal[];
} & AuditableEntity;

export type EmpresaConvenioListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: StatusConvenio;
};
