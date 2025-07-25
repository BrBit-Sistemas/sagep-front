import type { Detento, DetentoService, DetentoFichaCadastral } from '../types';
import type { CreateFichaCadastralDto, ReadFichaCadastralDto } from 'src/api/generated.schemas';

import { CONFIG } from 'src/global-config';
import { customInstance } from 'src/lib/axios';
import { getFichasCadastrais } from 'src/api/fichas-cadastrais';

import { Regime, Escolaridade } from '../types';

// Remover mock detento_fichas_cadastrais

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
  getFichasCadastrais: async (detentoId) => {
    const api = getFichasCadastrais();
    const response = await api.paginate({ detento_id: detentoId });
    return response.items.map((f: any) => ({
      fichacadastral_id: f.id,
      detento_id: f.detento_id,
      nome: f.nome,
      cpf: f.cpf,
      rg: f.rg,
      rg_expedicao: f.rg_expedicao,
      rg_orgao_uf: f.rg_orgao_uf,
      data_nascimento: f.data_nascimento,
      naturalidade: f.naturalidade,
      naturalidade_uf: f.naturalidade_uf,
      filiacao_mae: f.filiacao_mae,
      filiacao_pai: f.filiacao_pai,
      regime: f.regime,
      unidade_prisional: f.unidade_prisional,
      prontuario: f.prontuario,
      sei: f.sei,
      planilha: f.planilha,
      cidade_processo: f.cidade_processo,
      endereco: f.endereco,
      regiao_administrativa: f.regiao_administrativa,
      telefone: f.telefone,
      escolaridade: f.escolaridade,
      tem_problema_saude: f.tem_problema_saude,
      problema_saude: f.problema_saude,
      regiao_bloqueada: f.regiao_bloqueada,
      experiencia_profissional: f.experiencia_profissional,
      fez_curso_sistema_prisional: f.fez_curso_sistema_prisional,
      ja_trabalhou_funap: f.ja_trabalhou_funap,
      ano_trabalho_anterior: f.ano_trabalho_anterior,
      profissao_01: f.profissao_01,
      profissao_02: f.profissao_02,
      declaracao_veracidade: f.declaracao_veracidade,
      responsavel_preenchimento: f.responsavel_preenchimento,
      assinatura: f.assinatura,
      data_assinatura: f.data_assinatura,
      site_codigo: f.site_codigo,
      rodape_num_1: f.rodape_num_1,
      rodape_num_2: f.rodape_num_2,
      rodape_sei: f.rodape_sei,
      pdf_path: f.pdf_path,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      created_by: f.created_by,
      updated_by: f.updated_by,
    }));
  },
  createFichaCadastral: async (data) => {
    // Chama a API real para criar a ficha cadastral
    const api = getFichasCadastrais();
    const ficha = await api.create(data as CreateFichaCadastralDto);
    return ficha;
  },
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
    detentos = [...detentos.slice(0, detentoIndex), ...detentos.slice(detentoIndex + 1)];
  },
  getFichaCadastralPdfUrl: async (fichacadastral_id: string) => {
    const { url } = await customInstance<{ url: string }>({
      url: `/fichas-cadastrais/${fichacadastral_id}/pdf-url`,
      method: 'GET',
    });
    return url;
  },
};
