export type AuditableEntity = {
  createdAt: string;
  updatedAt: string;
  created_by?: string;
  updated_by?: string;
};

export type CrudService<TEntity, TCreate, TUpdate, TListParams> = {
  paginate: (params: TListParams) => Promise<PaginatedResponse<TEntity>>;
  create: (data: TCreate) => Promise<TEntity>;
  read: (id: string) => Promise<TEntity>;
  update: (id: string, data: TUpdate) => Promise<TEntity>;
  delete: (id: string) => Promise<void>;
};

export type PaginatedResponse<T> = {
  readonly totalPages: number;
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly hasNextPage: boolean;
  readonly hasPrevPage: boolean;
  readonly items: T[];
};

export type PaginatedParams = {
  page: number;
  limit: number;
  search?: string;
  nome?: string;
  cpf?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

// Re-export dos tipos prisionais para facilitar importação
export * from './prisional';
