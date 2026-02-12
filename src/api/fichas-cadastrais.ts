import type { BodyType } from '../lib/axios';

import { customInstance } from '../lib/axios';

export interface CreateFichaCadastralDto {
  // ... todos os campos necessários para criação, igual backend
}

export interface UpdateFichaCadastralDto {
  // ... todos os campos necessários para update, igual backend
}

export interface ReadFichaCadastralDto {
  // ... todos os campos retornados pelo backend
}

export interface FichaCadastralDocumentoUploadResponse {
  key: string;
  url: string;
  mime_type: string;
  file_size: number;
}

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getFichasCadastrais = () => {
  /**
   * @summary Criar uma nova ficha cadastral
   */
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

  /**
   * @summary Atualizar uma ficha cadastral
   */
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

  /**
   * @summary Buscar uma ficha cadastral pelo ID
   */
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
   * @summary Listar fichas cadastrais (paginação)
   */
  const paginate = (
    params?: { detento_id?: string; cpf?: string; status?: string } & Record<string, any>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<{ items: ReadFichaCadastralDto[]; total: number; page: number; limit: number }>(
      {
        url: `/fichas-cadastrais`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params,
      },
      options
    );

  /**
   * @summary Listar fichas inativas por detento
   */
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

  /**
   * @summary Remover uma ficha cadastral
   */
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

  return {
    create,
    update,
    findOne,
    paginate,
    findInativasByDetento,
    remove,
    uploadDocumento,
    getDocumentoUrl,
  };
};

export type CreateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getFichasCadastrais>['create']>>
>;
export type UpdateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getFichasCadastrais>['update']>>
>;
