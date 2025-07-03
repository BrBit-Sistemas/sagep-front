import type { Empresa } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateEmpresaSchema, UpdateEmpresaSchema } from '../schemas';

export const empresas: Empresa[] = [
  {
    empresa_id: '1',
    razao_social: 'Construtora ABC Ltda',
    cnpj: '12345678000195',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
  {
    empresa_id: '2',
    razao_social: 'Serviços XYZ S.A.',
    cnpj: '98765432000176',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
  {
    empresa_id: '3',
    razao_social: 'Tecnologia DEF Eireli',
    cnpj: '11223344000155',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
];

export const empresaService: CrudService<
  Empresa,
  CreateEmpresaSchema,
  UpdateEmpresaSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => {
    let filteredEmpresas = empresas;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredEmpresas = empresas.filter(
        (empresa) =>
          empresa.razao_social.toLowerCase().includes(searchLower) || empresa.cnpj.includes(search)
      );
    }

    return {
      totalPages: 1,
      page,
      limit,
      total: filteredEmpresas.length,
      hasNextPage: false,
      hasPrevPage: false,
      items: filteredEmpresas,
    };
  },
  create: async (data) => {
    const newEmpresa: Empresa = {
      ...data,
      empresa_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: '1',
      updated_by: '1',
    };
    empresas.push(newEmpresa);
    return newEmpresa;
  },
  read: async (id) => {
    const empresa = empresas.find((e) => e.empresa_id === id);
    if (!empresa) {
      throw new Error('Empresa não encontrada');
    }
    return empresa;
  },
  update: async (id, data) => {
    const empresaIndex = empresas.findIndex((e) => e.empresa_id === id);

    if (empresaIndex === -1) {
      throw new Error('Empresa não encontrada');
    }

    const empresa = empresas[empresaIndex];

    empresas[empresaIndex] = {
      ...empresa,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: '1',
    };

    return empresas[empresaIndex];
  },
  delete: async (id) => {
    const empresaIndex = empresas.findIndex((e) => e.empresa_id === id);
    if (empresaIndex === -1) {
      throw new Error('Empresa não encontrada');
    }
    empresas.splice(empresaIndex, 1);
  },
};
