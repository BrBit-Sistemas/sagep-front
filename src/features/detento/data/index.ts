import type { CrudService } from 'src/types';
import type { Detento, DetentoListParams } from '../types';

import { detentos } from './mock';

export const detentoService: CrudService<Detento, Detento, Detento, DetentoListParams> = {
  list: async ({ page, limit, search }) => detentos,
  create: async (data) => {
    const newDetento = { ...data, id: crypto.randomUUID() };
    detentos.push(newDetento);
    return newDetento;
  },
  read: async (id) => {
    const detento = detentos.find((d) => d.id === id);
    if (!detento) {
      throw new Error('Detento não encontrado');
    }
    return detento;
  },
  update: async (id, data) => {
    const detento = detentos.find((d) => d.id === id);
    if (!detento) {
      throw new Error('Detento não encontrado');
    }
    return { ...detento, ...data };
  },
  delete: async (id) => {
    const detentoIndex = detentos.findIndex((d) => d.id === id);
    if (detentoIndex === -1) {
      throw new Error('Detento não encontrado');
    }
    detentos.splice(detentoIndex, 1);
  },
};
