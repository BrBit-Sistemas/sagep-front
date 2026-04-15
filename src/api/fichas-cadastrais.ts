import type { BodyType } from '../lib/axios';

import { customInstance } from '../lib/axios';

// ---- Enums / tipos ------------------------------------------------------

export type StatusValidacaoFicha =
  | 'AGUARDANDO_VALIDACAO'
  | 'VALIDADO'
  | 'REQUER_CORRECAO'
  | 'FILA_DISPONIVEL';

export const STATUS_VALIDACAO_VALUES: StatusValidacaoFicha[] = [
  'AGUARDANDO_VALIDACAO',
  'VALIDADO',
  'REQUER_CORRECAO',
  'FILA_DISPONIVEL',
];

export type StatusOperacionalFicha = 'ativa' | 'inativa';

// ---- DTOs ---------------------------------------------------------------

export interface DetentoResumoDto {
  id: string;
  nome: string;
  prontuario?: string | null;
  cpf: string;
}

export interface CreateFichaCadastralDto {
  // ... todos os campos necessários para criação, igual backend
}

export interface UpdateFichaCadastralDto {
  // ... todos os campos necessários para update, igual backend
}

export interface ReadFichaCadastralDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;

  /** Dados principais de identificação do reeducando (denormalizados na ficha). */
  nome?: string;
  cpf?: string;
  rg?: string;
  data_nascimento?: string;
  regime?: string;
  prontuario?: string | null;
  unidade_prisional?: string;
  artigos_penais?: string[] | null;

  status?: StatusOperacionalFicha | string;
  status_validacao: StatusValidacaoFicha | string;
  substatus_operacional?: string | null;

  /** Fluxo de validação. */
  motivo_reprovacao?: string | null;
  validado_em?: string | null;
  validado_por?: string | null;
  /** Nome do usuário que executou a última decisão (populado via join no back-end). */
  validado_por_nome?: string | null;

  /** Relações. */
  detento_id?: string;
  detento?: DetentoResumoDto;
  documentos?: FichaCadastralDocumentoDto[];

  /** PDF. */
  pdf_path?: string | null;

  // os demais campos do DTO legado continuam existindo; deixamos o tipo aberto
  [key: string]: unknown;
}

export interface FichaCadastralDocumentoDto {
  id: string;
  nome: string;
  mime_type: string;
  file_size?: number;
  s3_key?: string;
  createdAt?: string;
}

export interface PaginateFichaCadastralDto {
  items: ReadFichaCadastralDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IndicadoresValidacaoDto {
  ativas: number;
  aprovadas: number;
  alertas: number;
  reprovadas: number;
  pendentes: number;
}

export interface FichaCadastralDocumentoUploadResponse {
  key: string;
  url: string;
  mime_type: string;
  file_size: number;
}

export interface PaginateFichasCadastraisParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  /** Filtro enum do fluxo de validação. */
  status_validacao?: StatusValidacaoFicha;
  /** Trecho no motivo de reprovação (case-insensitive). */
  motivo_reprovacao?: string;
  /** Status operacional — 'ativa' é o padrão quando filtramos pra validação. */
  status?: StatusOperacionalFicha;
  detento_id?: string;
  cpf?: string;
}

export interface RequererCorrecaoBody {
  motivo?: string;
}

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// ---- Factory ------------------------------------------------------------

export const getFichasCadastrais = () => {
  const create = (
    createFichaCadastralDto: BodyType<CreateFichaCadastralDto>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadFichaCadastralDto>(
      {
        url: `/fichas-cadastrais`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: createFichaCadastralDto,
      },
      options
    );

  const update = (
    id: string,
    updateFichaCadastralDto: BodyType<UpdateFichaCadastralDto>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadFichaCadastralDto>(
      {
        url: `/fichas-cadastrais/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: updateFichaCadastralDto,
      },
      options
    );

  const findOne = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<ReadFichaCadastralDto>(
      {
        url: `/fichas-cadastrais/${id}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options
    );

  /**
   * @summary Listar fichas cadastrais (paginação + filtros de validação)
   */
  const paginate = (
    params?: PaginateFichasCadastraisParams,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<PaginateFichaCadastralDto>(
      {
        url: `/fichas-cadastrais`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params,
      },
      options
    );

  /**
   * @summary Indicadores (5 cards) da tela de Validação
   */
  const indicadoresValidacao = (options?: SecondParameter<typeof customInstance>) =>
    customInstance<IndicadoresValidacaoDto>(
      {
        url: `/fichas-cadastrais/indicadores-validacao`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options
    );

  const findInativasByDetento = (
    detentoId: string,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadFichaCadastralDto[]>(
      {
        url: `/fichas-cadastrais/detento/${detentoId}/inativas`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options
    );

  const remove = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<void>(
      {
        url: `/fichas-cadastrais/${id}`,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
      options
    );

  const uploadDocumento = (
    file: File,
    detentoId?: string,
    options?: SecondParameter<typeof customInstance>
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    if (detentoId) {
      formData.append('detento_id', detentoId);
    }

    return customInstance<FichaCadastralDocumentoUploadResponse>(
      {
        url: `/fichas-cadastrais/documentos/upload`,
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      },
      options
    );
  };

  const getDocumentoUrl = (
    fichaId: string,
    documentoId: string,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<{ url: string }>(
      {
        url: `/fichas-cadastrais/${fichaId}/documentos/${documentoId}/url`,
        method: 'GET',
      },
      options
    );

  // ---- Transições de status ----

  /** Reabre a análise (REQUER_CORRECAO → AGUARDANDO_VALIDACAO). */
  const iniciarAnalise = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<{ status: 'ok' }>(
      {
        url: `/fichas-cadastrais/${id}/status/iniciar-analise`,
        method: 'POST',
      },
      options
    );

  /** Manda pra correção com motivo (→ REQUER_CORRECAO + grava motivo_reprovacao/validado_*). */
  const requererCorrecao = (
    id: string,
    body: BodyType<RequererCorrecaoBody>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<{ status: 'ok' }>(
      {
        url: `/fichas-cadastrais/${id}/status/requerer-correcao`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  /** Aprova (→ VALIDADO, grava validado_em + validado_por, zera motivo_reprovacao). */
  const aprovar = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<{ status: 'ok' }>(
      {
        url: `/fichas-cadastrais/${id}/status/aprovar`,
        method: 'POST',
      },
      options
    );

  /** Libera pra fila (VALIDADO → FILA_DISPONIVEL). */
  const filaDisponivel = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<{ status: 'ok' }>(
      {
        url: `/fichas-cadastrais/${id}/status/fila-disponivel`,
        method: 'POST',
      },
      options
    );

  return {
    create,
    update,
    findOne,
    paginate,
    indicadoresValidacao,
    findInativasByDetento,
    remove,
    uploadDocumento,
    getDocumentoUrl,
    iniciarAnalise,
    requererCorrecao,
    aprovar,
    filaDisponivel,
  };
};

export type CreateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getFichasCadastrais>['create']>>
>;
export type UpdateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getFichasCadastrais>['update']>>
>;
