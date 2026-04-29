import type { CrudService } from 'src/types';
import type { Empresa, EmpresaListParams } from '../types';
import type { CreateEmpresaSchema, UpdateEmpresaSchema } from '../schemas';

import {
  getEmpresas,
  type ReadEmpresaDto,
  type EmpresaMetricsDto,
  type PaginateEmpresaDto,
} from 'src/api/empresas/empresas';

const sanitizeCnpj = (value: string) => value.replace(/\D/g, '');
const sanitizeCep = (value: string) => value.replace(/\D/g, '');

const fromApi = (dto: ReadEmpresaDto): Empresa => ({
  id: dto.empresa_id, // MUI DataGrid precisa do campo 'id'
  empresa_id: dto.empresa_id,
  razao_social: dto.razao_social,
  cnpj: dto.cnpj,
  tipo: dto.tipo,
  inscricao_estadual: dto.inscricao_estadual,
  logradouro: dto.logradouro,
  logradouro_numero: dto.logradouro_numero,
  cep: dto.cep,
  cidade: dto.cidade,
  estado: dto.estado,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  created_by: undefined,
  updated_by: undefined,
});

export const empresaService: CrudService<
  Empresa,
  CreateEmpresaSchema,
  UpdateEmpresaSchema,
  EmpresaListParams
> = {
  paginate: async ({ page, limit, search, tipo, sort, order }: EmpresaListParams) => {
    const api = getEmpresas();
    // Converter página de 1-based (frontend) para 0-based (backend)
    const backendPage = page - 1;

    const response: PaginateEmpresaDto = await api.findAll({
      page: backendPage,
      limit,
      search,
      ...(tipo ? { tipo: tipo as 'PRIVADA' | 'PUBLICA' } : {}),
    });

    return {
      totalPages: response.totalPages,
      page: Number(response.page) + 1, // Converter de volta para 1-based para o frontend
      limit: response.limit,
      total: response.total,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      items: response.items.map(fromApi),
    } as const;
  },
  create: async (data) => {
    const api = getEmpresas();
    const dto = await api.create({
      razao_social: data.razao_social,
      cnpj: sanitizeCnpj(data.cnpj),
      tipo: data.tipo,
      ...(data.inscricao_estadual ? { inscricao_estadual: data.inscricao_estadual } : {}),
      logradouro: data.logradouro,
      logradouro_numero: data.logradouro_numero,
      cep: sanitizeCep(data.cep),
      cidade: data.cidade,
      estado: data.estado.toUpperCase(),
    });
    return fromApi(dto);
  },
  read: async (id) => {
    const api = getEmpresas();
    const dto = await api.findOne(id);
    return fromApi(dto);
  },
  update: async (id, data) => {
    const api = getEmpresas();
    const payload = {
      ...(data.razao_social ? { razao_social: data.razao_social } : {}),
      ...(data.cnpj ? { cnpj: sanitizeCnpj(data.cnpj) } : {}),
      ...(data.tipo ? { tipo: data.tipo } : {}),
      ...(data.inscricao_estadual !== undefined ? { inscricao_estadual: data.inscricao_estadual } : {}),
      ...(data.logradouro ? { logradouro: data.logradouro } : {}),
      ...(data.logradouro_numero ? { logradouro_numero: data.logradouro_numero } : {}),
      ...(data.cep ? { cep: sanitizeCep(data.cep) } : {}),
      ...(data.cidade ? { cidade: data.cidade } : {}),
      ...(data.estado ? { estado: data.estado.toUpperCase() } : {}),
    };
    const dto = await api.update(id, payload);
    return fromApi(dto);
  },
  delete: async (id) => {
    const api = getEmpresas();
    await api.remove(id);
  },
};

export const empresaMetrics = async (): Promise<EmpresaMetricsDto> => {
  const api = getEmpresas();
  return api.metrics();
};
