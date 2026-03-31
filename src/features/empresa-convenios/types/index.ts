import type { AuditableEntity } from 'src/types';

export type ModalidadeExecucao = 'INTRAMUROS' | 'EXTRAMUROS';

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
  id: string;
  convenio_id: string;
  empresa_id: string;
  modalidade_execucao: ModalidadeExecucao;
  regimes_permitidos: number[];
  artigos_vedados: string[];
  max_reeducandos?: number | null;
  permite_variacao_quantidade: boolean;
  data_inicio: string;
  data_fim?: string | null;
  modelo_remuneracao_id: string;
  politica_beneficio_id: string;
  permite_bonus_produtividade: boolean;
  percentual_gestao?: number | null;
  percentual_contrapartida?: number | null;
  observacoes?: string;
  locais_execucao?: EmpresaConvenioLocal[];
} & AuditableEntity;

export type EmpresaConvenioListParams = {
  page: number;
  limit: number;
  search?: string;
};
