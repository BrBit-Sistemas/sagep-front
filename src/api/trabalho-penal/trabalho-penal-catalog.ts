import { type BodyType, customInstance } from '../../lib/axios';

export type NivelRemuneracao = 'I' | 'II' | 'III';

export type TipoCalculoRemuneracao = 'MENSAL' | 'HORA' | 'HIBRIDO';

export type ResponsavelBeneficio = 'FUNAP' | 'EMPRESA' | 'NENHUM';

export type ReadModeloRemuneracaoNivelCatalogDto = {
  nivel: NivelRemuneracao;
  valor_bolsa: number;
};

export type ReadModeloRemuneracaoCatalogDto = {
  modelo_remuneracao_id: string;
  nome: string;
  usa_nivel: boolean;
  tipo_calculo: TipoCalculoRemuneracao;
  niveis: ReadModeloRemuneracaoNivelCatalogDto[];
};

export type CreateModeloRemuneracaoDto = {
  nome: string;
  usa_nivel?: boolean;
  tipo_calculo: TipoCalculoRemuneracao;
  niveis?: ReadModeloRemuneracaoNivelCatalogDto[];
};

export type UpdateModeloRemuneracaoDto = Partial<CreateModeloRemuneracaoDto>;

export type ReadPoliticaBeneficioCatalogDto = {
  politica_beneficio_id: string;
  tipo_transporte: ResponsavelBeneficio;
  tipo_alimentacao: ResponsavelBeneficio;
  valor_transporte_padrao: number;
  valor_alimentacao_padrao: number;
  variavel_por_dia: boolean;
};

export type CreatePoliticaBeneficioDto = {
  tipo_transporte: ResponsavelBeneficio;
  tipo_alimentacao: ResponsavelBeneficio;
  valor_transporte_padrao?: number;
  valor_alimentacao_padrao?: number;
  variavel_por_dia?: boolean;
};

export type UpdatePoliticaBeneficioDto = Partial<CreatePoliticaBeneficioDto>;

export const getTrabalhoPenalCatalog = () => {
  const base = '/trabalho-penal';

  const listModelosRemuneracao = (
    options?: Parameters<typeof customInstance<ReadModeloRemuneracaoCatalogDto[]>>[1],
  ) =>
    customInstance<ReadModeloRemuneracaoCatalogDto[]>(
      { url: `${base}/modelos-remuneracao`, method: 'GET' },
      options,
    );

  const createModeloRemuneracao = (
    body: BodyType<CreateModeloRemuneracaoDto>,
    options?: Parameters<typeof customInstance<ReadModeloRemuneracaoCatalogDto>>[1],
  ) =>
    customInstance<ReadModeloRemuneracaoCatalogDto>(
      { url: `${base}/modelos-remuneracao`, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: body },
      options,
    );

  const updateModeloRemuneracao = (
    modeloId: string,
    body: BodyType<UpdateModeloRemuneracaoDto>,
    options?: Parameters<typeof customInstance<ReadModeloRemuneracaoCatalogDto>>[1],
  ) =>
    customInstance<ReadModeloRemuneracaoCatalogDto>(
      {
        url: `${base}/modelos-remuneracao/${modeloId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options,
    );

  const removeModeloRemuneracao = (
    modeloId: string,
    options?: Parameters<typeof customInstance<void>>[1],
  ) => customInstance<void>({ url: `${base}/modelos-remuneracao/${modeloId}`, method: 'DELETE' }, options);

  const listPoliticasBeneficio = (
    options?: Parameters<typeof customInstance<ReadPoliticaBeneficioCatalogDto[]>>[1],
  ) =>
    customInstance<ReadPoliticaBeneficioCatalogDto[]>(
      { url: `${base}/politicas-beneficio`, method: 'GET' },
      options,
    );

  const createPoliticaBeneficio = (
    body: BodyType<CreatePoliticaBeneficioDto>,
    options?: Parameters<typeof customInstance<ReadPoliticaBeneficioCatalogDto>>[1],
  ) =>
    customInstance<ReadPoliticaBeneficioCatalogDto>(
      { url: `${base}/politicas-beneficio`, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: body },
      options,
    );

  const updatePoliticaBeneficio = (
    politicaId: string,
    body: BodyType<UpdatePoliticaBeneficioDto>,
    options?: Parameters<typeof customInstance<ReadPoliticaBeneficioCatalogDto>>[1],
  ) =>
    customInstance<ReadPoliticaBeneficioCatalogDto>(
      {
        url: `${base}/politicas-beneficio/${politicaId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options,
    );

  const removePoliticaBeneficio = (
    politicaId: string,
    options?: Parameters<typeof customInstance<void>>[1],
  ) => customInstance<void>({ url: `${base}/politicas-beneficio/${politicaId}`, method: 'DELETE' }, options);

  return {
    listModelosRemuneracao,
    createModeloRemuneracao,
    updateModeloRemuneracao,
    removeModeloRemuneracao,
    listPoliticasBeneficio,
    createPoliticaBeneficio,
    updatePoliticaBeneficio,
    removePoliticaBeneficio,
  };
};
