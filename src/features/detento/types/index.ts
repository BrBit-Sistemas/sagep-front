export type Detento = {
  id: string;
  nome: string;
  cpf: string;
};

export type DetentoListParams = {
  page: number;
  limit: number;
  search: string;
};
