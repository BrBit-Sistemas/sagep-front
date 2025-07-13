import type { Profissao } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateProfissaoSchema, UpdateProfissaoSchema } from '../schemas';

export const profissoes: Profissao[] = [
  {
    profissao_id: '1',
    nome: 'Advogado',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
  {
    profissao_id: '2',
    nome: 'Pedreiro',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
  {
    profissao_id: '3',
    nome: 'Professor',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
];

export const profissaoService: CrudService<
  Profissao,
  CreateProfissaoSchema,
  UpdateProfissaoSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => {
    let filteredProfissoes = profissoes;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProfissoes = profissoes.filter((profissao) =>
        profissao.nome.toLowerCase().includes(searchLower)
      );
    }

    return {
      totalPages: 1,
      page,
      limit,
      total: filteredProfissoes.length,
      hasNextPage: false,
      hasPrevPage: false,
      items: filteredProfissoes,
    };
  },
  create: async (data) => {
    const newProfissao: Profissao = {
      ...data,
      profissao_id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      created_by: '1',
      updated_by: '1',
    };
    profissoes.push(newProfissao);
    return newProfissao;
  },
  read: async (id) => {
    const profissao = profissoes.find((p) => p.profissao_id === id);
    if (!profissao) {
      throw new Error('Profissão não encontrada');
    }
    return profissao;
  },
  update: async (id, data) => {
    const profissaoIndex = profissoes.findIndex((p) => p.profissao_id === id);

    if (profissaoIndex === -1) {
      throw new Error('Profissão não encontrada');
    }

    const profissao = profissoes[profissaoIndex];

    profissoes[profissaoIndex] = {
      ...profissao,
      ...data,
      updatedAt: new Date().toISOString(),
      updated_by: '1',
    };

    return profissoes[profissaoIndex];
  },
  delete: async (id) => {
    const profissaoIndex = profissoes.findIndex((p) => p.profissao_id === id);
    if (profissaoIndex === -1) {
      throw new Error('Profissão não encontrada');
    }
    profissoes.splice(profissaoIndex, 1);
  },
};
