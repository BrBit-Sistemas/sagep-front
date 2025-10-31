import type { CreateFichaCadastralDto } from 'src/api/generated.schemas';
import type { Regime, Detento, Escolaridade, DetentoService } from '../types';

import { customInstance } from 'src/lib/axios';
import { getFichasCadastrais } from 'src/api/fichas-cadastrais';
import { getDetentos, type ReadDetentoDto } from 'src/api/detentos/detentos';

// Remover mock detento_fichas_cadastrais

// API client
const api = getDetentos();

const mapDocumentosPayload = (documentos?: any[]) =>
  (documentos || []).map((doc) => ({
    ...(doc.id ? { id: doc.id } : {}),
    nome: doc.nome,
    s3_key: doc.s3_key,
    mime_type: doc.mime_type,
    file_size: doc.file_size,
    ...(doc.url ? { url: doc.url } : {}),
  }));

function toDetento(dto: ReadDetentoDto): Detento {
  return {
    id: dto.id,
    nome: dto.nome,
    mae: dto.mae,
    prontuario: dto.prontuario,
    cpf: dto.cpf,
    data_nascimento: dto.data_nascimento,
    regime: dto.regime as Regime,
    escolaridade: dto.escolaridade as Escolaridade,
    unidade_id: dto.unidade_id,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    created_by: dto.created_by,
    updated_by: dto.updated_by,
    ficha_cadastral_created_at: dto.ficha_cadastral_created_at ?? null,
    status_validacao: (dto as any).status_validacao ?? null,
  };
}

export const detentoService: DetentoService = {
  getFichasCadastrais: async (detentoId) => {
    const fichasApi = getFichasCadastrais();
    const response = await fichasApi.paginate({ detento_id: detentoId });
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
      // Campos antigos de endereço
      endereco: f.endereco,
      regiao_administrativa: f.regiao_administrativa,
      telefone: f.telefone,
      // Novos campos de endereço estruturados
      cep: f.cep,
      logradouro: f.logradouro,
      numero: f.numero,
      complemento: f.complemento,
      bairro: f.bairro,
      cidade: f.cidade,
      estado: f.estado,
      ra_df: f.ra_df,
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
      artigos_penais: (f as any).artigos_penais ?? [],
      responsavel_preenchimento: f.responsavel_preenchimento,
      assinatura: f.assinatura,
      data_assinatura: f.data_assinatura,
      pdf_path: f.pdf_path,
      status: f.status,
      status_validacao: f.status_validacao,
      substatus_operacional: f.substatus_operacional,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      created_by: f.created_by,
      updated_by: f.updated_by,
      documentos: (f.documentos || []).map((doc: any) => ({
        id: doc.id,
        ficha_cadastral_id: doc.ficha_cadastral_id || doc.fichacadastral_id || f.id,
        nome: doc.nome,
        s3_key: doc.s3_key,
        mime_type: doc.mime_type,
        file_size: doc.file_size,
        url: doc.url,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        deletedAt: doc.deletedAt,
      })),
    }));
  },
  createFichaCadastral: async (data) => {
    // Chama a API real para criar a ficha cadastral
    const fichasApi = getFichasCadastrais();
    const ficha = await fichasApi.create({
      ...data,
      documentos: mapDocumentosPayload((data as any)?.documentos),
    } as CreateFichaCadastralDto);
    return ficha;
  },
  updateFichaCadastral: async (fichacadastral_id, data) => {
    const fichasApi = getFichasCadastrais();
    return fichasApi.update(fichacadastral_id, {
      ...data,
      documentos: mapDocumentosPayload((data as any)?.documentos),
    });
  },
  paginate: async ({ page, limit, search, cpf, nome, sort, order }: any) => {
    // Converter página de 1-based (frontend) para 0-based (backend)
    const backendPage = page - 1;
    

    const res = await api.findAll({ page: backendPage, limit, search, cpf, nome, sort, order });

    const result = {
      items: res.items.map(toDetento),
      page: Number(res.page) + 1, // Converter de volta para 1-based para o frontend
      limit: res.limit,
      total: res.total,
      totalPages: Math.ceil((res.total ?? 0) / (res.limit || 1)) || 0,
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
    } as const;


    return result;
  },
  create: async (data) => {
    const dto = await api.create(data);
    return toDetento(dto);
  },
  read: async (id) => {
    const dto = await api.findOne(id);
    return toDetento(dto);
  },
  update: async (id, data) => {
    const dto = await api.update(id, data);
    return toDetento(dto);
  },
  delete: async (id) => {
    await api.remove(id);
  },
  deleteFichaCadastral: async (fichacadastral_id) => {
    const fichasApi = getFichasCadastrais();
    return fichasApi.remove(fichacadastral_id);
  },
  getFichaCadastralPdfUrl: async (fichacadastral_id: string) => {
    const { url } = await customInstance<{ url: string }>({
      url: `/fichas-cadastrais/${fichacadastral_id}/pdf-url`,
      method: 'GET',
    });
    return url;
  },
};
