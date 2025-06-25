export type CrudService<TEntity, TCreate, TUpdate, TListParams> = {
  list: (params: TListParams) => Promise<TEntity[]>;
  create: (data: TCreate) => Promise<TEntity>;
  read: (id: string) => Promise<TEntity>;
  update: (id: string, data: TUpdate) => Promise<TEntity>;
  delete: (id: string) => Promise<void>;
};
