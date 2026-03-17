import type { APIRequestContext } from '@playwright/test';

import { expect } from '@playwright/test';

import type { AssetName } from './file-factory';
import type { FichaDraft } from '../fixtures/ficha-data';

import { getAssetBuffer, getAssetMimeType, getAssetPath } from './file-factory';

type PaginatedResponse<T> = {
  items: T[];
  total: number;
};

type UnidadeResponse = {
  id: string;
  nome: string;
};

type DetentoResponse = {
  id: string;
  nome: string;
  mae: string;
  prontuario?: string | null;
  cpf: string;
  data_nascimento: string;
  regime: string;
  escolaridade: string;
  unidade_id: string;
};

type UploadedDocumentoResponse = {
  key: string;
  url: string;
  mime_type: string;
  file_size: number;
};

type ProfissaoResponse = {
  id: string;
  nome: string;
};

type FichaResponse = {
  id: string;
  detento_id: string;
  nome: string;
  cpf: string;
  prontuario?: string | null;
  unidade_prisional: string;
  status: 'ativa' | 'inativa';
  pdf_path?: string;
  experiencia_profissional?: string;
  documentos?: Array<{
    id: string;
    nome: string;
    s3_key: string;
    mime_type: string;
    file_size: number;
  }>;
};

export async function getFirstUnidade(
  api: APIRequestContext
): Promise<UnidadeResponse> {
  const response = await api.get('/unidades-prisionais', {
    params: { page: 0, limit: 10 },
  });

  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as PaginatedResponse<UnidadeResponse>;
  const unidade = body.items[0];

  if (!unidade) {
    throw new Error('Nenhuma unidade prisional foi encontrada para os testes E2E.');
  }

  return unidade;
}

export async function createDetento(
  api: APIRequestContext,
  payload: FichaDraft['detento']
): Promise<DetentoResponse> {
  const response = await api.post('/detentos', {
    data: payload,
  });

  expect(response.ok()).toBeTruthy();
  return (await response.json()) as DetentoResponse;
}

export async function findDetentoByCpf(
  api: APIRequestContext,
  cpf: string
): Promise<DetentoResponse | null> {
  const response = await api.get('/detentos', {
    params: { page: 0, limit: 5, cpf },
  });

  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as PaginatedResponse<DetentoResponse>;
  return body.items.find((item) => item.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, '')) ?? null;
}

export async function uploadDocumento(
  api: APIRequestContext,
  assetName: AssetName,
  detentoId?: string
): Promise<UploadedDocumentoResponse> {
  const response = await api.post('/fichas-cadastrais/documentos/upload', {
    multipart: {
      ...(detentoId ? { detento_id: detentoId } : {}),
      file: {
        name: getAssetPath(assetName).split('/').pop() ?? assetName,
        mimeType: getAssetMimeType(assetName),
        buffer: await getAssetBuffer(assetName),
      },
    },
  });

  expect(response.ok()).toBeTruthy();
  return (await response.json()) as UploadedDocumentoResponse;
}

export async function assignProfissoesFromApi(
  api: APIRequestContext,
  draft: FichaDraft
): Promise<FichaDraft> {
  const response = await api.get('/profissoes', {
    params: { page: 0, limit: 20 },
  });

  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as PaginatedResponse<ProfissaoResponse>;
  const [primeiraProfissao, segundaProfissao] = body.items;

  if (!primeiraProfissao) {
    throw new Error('Nenhuma profissao foi encontrada para preencher os testes E2E.');
  }

  draft.form.profissao_01 = primeiraProfissao.nome;
  draft.form.profissao_01_search = primeiraProfissao.nome.slice(0, 3);
  draft.form.profissao_02 = segundaProfissao?.nome ?? '';
  draft.form.profissao_02_search = segundaProfissao?.nome.slice(0, 3) ?? '';

  return draft;
}

export function buildFichaRequestFromDraft({
  draft,
  detentoId,
  documentos,
  status = 'ativa',
}: {
  draft: FichaDraft;
  detentoId: string;
  documentos: UploadedDocumentoResponse[];
  status?: 'ativa' | 'inativa';
}) {
  return {
    detento_id: detentoId,
    nome: draft.form.nome,
    cpf: draft.form.cpf,
    rg: draft.form.rg,
    rg_orgao_uf: `${draft.form.rg_orgao}/${draft.form.rg_uf}`,
    data_nascimento: draft.form.data_nascimento,
    naturalidade: draft.form.naturalidade,
    naturalidade_uf: draft.form.naturalidade_uf,
    filiacao_mae: draft.form.filiacao_mae,
    filiacao_pai: draft.form.filiacao_pai,
    regime: draft.form.regime,
    unidade_prisional: draft.form.unidade_prisional,
    prontuario: draft.form.prontuario,
    sei: draft.form.sei,
    telefone: draft.form.telefone,
    estado: draft.form.endereco.estado,
    cidade: draft.form.endereco.cidade,
    logradouro: draft.form.endereco.logradouro,
    numero: draft.form.endereco.numero,
    complemento: draft.form.endereco.complemento,
    bairro: draft.form.endereco.bairro,
    ra_df: draft.form.endereco.ra_df,
    escolaridade: draft.form.escolaridade,
    tem_problema_saude: draft.form.tem_problema_saude,
    problema_saude: draft.form.problema_saude,
    regiao_bloqueada: draft.form.regiao_bloqueada,
    experiencia_profissional: draft.form.experiencia_profissional,
    fez_curso_sistema_prisional: draft.form.fez_curso_sistema_prisional,
    disponibilidade_trabalho: draft.form.disponibilidade_trabalho,
    ja_trabalhou_funap: draft.form.ja_trabalhou_funap,
    ano_trabalho_anterior: draft.form.ano_trabalho_anterior,
    profissao_01: draft.form.profissao_01,
    profissao_02: draft.form.profissao_02,
    artigos_penais: draft.form.artigos_penais,
    responsavel_preenchimento: draft.form.responsavel_preenchimento,
    assinatura: draft.form.assinatura,
    data_assinatura: '2024-01-15',
    status,
    documentos: documentos.map((documento, index) => ({
      nome: `Documento API ${index + 1}`,
      s3_key: documento.key,
      mime_type: documento.mime_type,
      file_size: documento.file_size,
      url: documento.url,
    })),
  };
}

export async function createFichaFromDraft(
  api: APIRequestContext,
  params: {
    draft: FichaDraft;
    detentoId: string;
    documentos: UploadedDocumentoResponse[];
    status?: 'ativa' | 'inativa';
  }
): Promise<FichaResponse> {
  const response = await api.post('/fichas-cadastrais', {
    data: buildFichaRequestFromDraft(params),
  });

  expect(response.ok()).toBeTruthy();
  return (await response.json()) as FichaResponse;
}

export async function getFichasByDetento(
  api: APIRequestContext,
  detentoId: string
): Promise<FichaResponse[]> {
  const response = await api.get('/fichas-cadastrais', {
    params: { page: 0, limit: 20, detento_id: detentoId },
  });

  expect(response.ok()).toBeTruthy();

  const body = (await response.json()) as PaginatedResponse<FichaResponse>;
  return body.items;
}

export async function getFichaPdfUrl(
  api: APIRequestContext,
  fichaId: string
): Promise<string> {
  const response = await api.get(`/fichas-cadastrais/${fichaId}/pdf-url`);

  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { url: string };
  return body.url;
}

export async function createDetentoWithFicha(
  api: APIRequestContext,
  params: {
    draft: FichaDraft;
    status?: 'ativa' | 'inativa';
    assetName?: AssetName;
  }
): Promise<{
  detento: DetentoResponse;
  ficha: FichaResponse;
}> {
  const detento = await createDetento(api, params.draft.detento);
  const uploaded = await uploadDocumento(api, params.assetName ?? 'validPng', detento.id);
  const ficha = await createFichaFromDraft(api, {
    draft: params.draft,
    detentoId: detento.id,
    documentos: [uploaded],
    status: params.status,
  });

  return { detento, ficha };
}

export async function ensureDetentoWithFicha(
  api: APIRequestContext,
  params: {
    draft: FichaDraft;
    status?: 'ativa' | 'inativa';
    assetName?: AssetName;
  }
): Promise<{
  detento: DetentoResponse;
  ficha: FichaResponse;
}> {
  const status = params.status ?? 'ativa';
  const detentoExistente = await findDetentoByCpf(api, params.draft.cpf);

  if (detentoExistente) {
    const fichas = await getFichasByDetento(api, detentoExistente.id);
    const fichaExistente = fichas.find((item) => item.status === status);

    if (fichaExistente) {
      return { detento: detentoExistente, ficha: fichaExistente };
    }
  }

  return createDetentoWithFicha(api, params);
}
