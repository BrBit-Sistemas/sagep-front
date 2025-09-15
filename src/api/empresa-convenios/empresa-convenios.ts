import { customInstance, type BodyType } from '../../lib/axios';

// DTOs aligned with backend controller
export type CreateEmpresaConvenioDto = {
  empresa_id: string;
  tipo_codigo: string;
  modalidade_execucao: 'INTRAMUROS' | 'EXTRAMUROS';
  regimes_permitidos: number[];
  artigos_vedados?: number[];
  quantitativos_profissoes?: { profissao_id: string; quantidade: number }[];
  data_inicio: string; // YYYY-MM-DD
  data_fim?: string | null;
  status: 'RASCUNHO' | 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';
  observacoes?: string;
};

export type UpdateEmpresaConvenioDto = Partial<CreateEmpresaConvenioDto>;

export type ReadEmpresaConvenioDto = CreateEmpresaConvenioDto & {
  convenio_id: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginateEmpresaConvenioDto = {
  items: ReadEmpresaConvenioDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ListParams = { page?: number; limit?: number; search?: string };

export const getEmpresaConvenios = () => {
  const base = '/empresa-convenios';

  const create = (
    body: BodyType<CreateEmpresaConvenioDto>,
    options?: Parameters<typeof customInstance>[1],
  ) =>
    customInstance<ReadEmpresaConvenioDto>(
      { url: base, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: body },
      options,
    );

  const findAll = (params?: ListParams, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<PaginateEmpresaConvenioDto>({ url: base, method: 'GET', params }, options);

  const findOne = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<ReadEmpresaConvenioDto>({ url: `${base}/${id}`, method: 'GET' }, options);

  const update = (
    id: string,
    body: BodyType<UpdateEmpresaConvenioDto>,
    options?: Parameters<typeof customInstance>[1],
  ) =>
    customInstance<ReadEmpresaConvenioDto>(
      { url: `${base}/${id}`, method: 'PUT', headers: { 'Content-Type': 'application/json' }, data: body },
      options,
    );

  const remove = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<void>({ url: `${base}/${id}`, method: 'DELETE' }, options);

  return { create, findAll, findOne, update, remove };
};
