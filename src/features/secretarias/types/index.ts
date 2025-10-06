export interface Regional {
  id: string;
  secretariaId: string;
  nome: string;
  secretaria?: {
    id: string;
    nome: string;
  };
  unidades?: Array<{
    id: string;
    nome: string;
  }>;
}

export interface CreateRegional {
  secretariaId: string;
  nome: string;
}

export interface UpdateRegional extends CreateRegional {
  id: string;
}

export interface RegionalFilters {
  nome?: string;
  secretariaId?: string;
}

export type SecretariaListParams = {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};
