import type { Detento } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateDetentoSchema, UpdateDetentoSchema } from '../schemas';

import { Regime, Escolaridade } from '../types';

export const detentos: Detento[] = [
  {
    detento_id: '1',
    nome: 'João da Silva',
    prontuario: '1234567890',
    cpf: '12345678900',
    data_nascimento: '1990-01-01',
    regime: Regime.FECHADO,
    escolaridade: Escolaridade.FUNDAMENTAL,
    unidade_id: '1',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
];

export const detentoService: CrudService<
  Detento,
  CreateDetentoSchema,
  UpdateDetentoSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => ({
    totalPages: 1,
    page,
    limit,
    total: detentos.length,
    hasNextPage: false,
    hasPrevPage: false,
    items: detentos,
  }),
  create: async (data) => {
    const newDetento: Detento = {
      ...data,
      detento_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: '1',
      updated_by: '1',
    };
    detentos.push(newDetento);
    return newDetento;
  },
  read: async (id) => {
    const detento = detentos.find((d) => d.detento_id === id);
    if (!detento) {
      throw new Error('Detento não encontrado');
    }
    return detento;
  },
  update: async (id, data) => {
    const detentoIndex = detentos.findIndex((d) => d.detento_id === id);

    if (detentoIndex === -1) {
      throw new Error('Detento não encontrado');
    }

    const detento = detentos[detentoIndex];

    detentos[detentoIndex] = {
      ...detento,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: '1',
    };

    return detento;
  },
  delete: async (id) => {
    const detentoIndex = detentos.findIndex((d) => d.detento_id === id);
    if (detentoIndex === -1) {
      throw new Error('Detento não encontrado');
    }
    detentos.splice(detentoIndex, 1);
  },
};
