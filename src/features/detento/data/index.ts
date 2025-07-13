import type { Detento, DetentoService, DetentoFichaCadastral } from '../types';

import { CONFIG } from 'src/global-config';

import { Regime, Escolaridade } from '../types';

const detento_fichas_cadastrais: DetentoFichaCadastral[] = [
  {
    fichacadastral_id: '1',
    detento_id: '1',
    tem_problema_saude: true,
    regiao_bloqueada: 'Região 1',
    ja_trabalhou_funap: true,
    ano_trabalho_anterior: 2024,
    pdf_path: `${CONFIG.assetsDir}/files/pdf_example.pdf`,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
];

let detentos: Detento[] = [
  {
    detento_id: '1',
    nome: 'João da Silva',
    prontuario: '1234567890',
    cpf: '12345678900',
    data_nascimento: '1990-01-01',
    regime: Regime.FECHADO,
    escolaridade: Escolaridade.FUNDAMENTAL,
    unidade_id: '1',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    created_by: '1',
    updated_by: '1',
  },
];

export const detentoService: DetentoService = {
  getFichasCadastrais: async (detentoId) =>
    detento_fichas_cadastrais.filter((f) => f.detento_id === detentoId),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      created_by: '1',
      updated_by: '1',
    };
    // Para evitar problemas de objeto não extensível, criamos um novo array
    detentos = [...detentos, newDetento];
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

    const updatedDetento: Detento = {
      ...detento,
      ...data,
      updatedAt: new Date().toISOString(),
      updated_by: '1',
    };

    // Atualiza o array de forma imutável
    detentos = [
      ...detentos.slice(0, detentoIndex),
      updatedDetento,
      ...detentos.slice(detentoIndex + 1),
    ];

    return updatedDetento;
  },
  delete: async (id) => {
    const detentoIndex = detentos.findIndex((d) => d.detento_id === id);
    if (detentoIndex === -1) {
      throw new Error('Detento não encontrado');
    }
    // Remove o item de forma imutável
    detentos = [...detentos.slice(0, detentoIndex), ...detentos.slice(detentoIndex + 1)];
  },
};
