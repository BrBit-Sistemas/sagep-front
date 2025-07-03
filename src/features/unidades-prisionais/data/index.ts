import type { UnidadePrisional } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateUnidadePrisionalSchema, UpdateUnidadePrisionalSchema } from '../schemas';

export const unidadesPrisionais: UnidadePrisional[] = [
  {
    unidade_id: '1',
    nome: 'Penitenciária Central',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
  {
    unidade_id: '2',
    nome: 'Casa de Detenção',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
  {
    unidade_id: '3',
    nome: 'Centro de Ressocialização',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
];

export const unidadePrisionalService: CrudService<
  UnidadePrisional,
  CreateUnidadePrisionalSchema,
  UpdateUnidadePrisionalSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => {
    let filteredUnidades = unidadesPrisionais;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUnidades = unidadesPrisionais.filter((unidade) =>
        unidade.nome.toLowerCase().includes(searchLower)
      );
    }

    return {
      totalPages: 1,
      page,
      limit,
      total: filteredUnidades.length,
      hasNextPage: false,
      hasPrevPage: false,
      items: filteredUnidades,
    };
  },
  create: async (data) => {
    const newUnidade: UnidadePrisional = {
      ...data,
      unidade_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: '1',
      updated_by: '1',
    };
    unidadesPrisionais.push(newUnidade);
    return newUnidade;
  },
  read: async (id) => {
    const unidade = unidadesPrisionais.find((u) => u.unidade_id === id);
    if (!unidade) {
      throw new Error('Unidade Prisional não encontrada');
    }
    return unidade;
  },
  update: async (id, data) => {
    const unidadeIndex = unidadesPrisionais.findIndex((u) => u.unidade_id === id);

    if (unidadeIndex === -1) {
      throw new Error('Unidade Prisional não encontrada');
    }

    const unidade = unidadesPrisionais[unidadeIndex];

    unidadesPrisionais[unidadeIndex] = {
      ...unidade,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: '1',
    };

    return unidadesPrisionais[unidadeIndex];
  },
  delete: async (id) => {
    const unidadeIndex = unidadesPrisionais.findIndex((u) => u.unidade_id === id);
    if (unidadeIndex === -1) {
      throw new Error('Unidade Prisional não encontrada');
    }
    unidadesPrisionais.splice(unidadeIndex, 1);
  },
};
