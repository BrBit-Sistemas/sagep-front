export interface Profissao {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfissao {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateProfissao extends CreateProfissao {
  id: string;
}

export interface ProfissaoFilters {
  nome?: string;
  ativo?: boolean;
}

export type ProfissaoListParams = {
  page: number;
  limit: number;
  search?: string;
};
