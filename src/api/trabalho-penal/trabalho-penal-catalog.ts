import { customInstance } from '../../lib/axios';

export type ReadModeloRemuneracaoCatalogDto = {
  modelo_remuneracao_id: string;
  nome: string;
  usa_nivel: boolean;
  tipo_calculo: string;
};

export type ReadPoliticaBeneficioCatalogDto = {
  politica_beneficio_id: string;
  tipo_transporte: string;
  tipo_alimentacao: string;
  valor_transporte_padrao: number;
  valor_alimentacao_padrao: number;
  variavel_por_dia: boolean;
};

export const getTrabalhoPenalCatalog = () => {
  const base = '/trabalho-penal';
  const listModelosRemuneracao = (
    options?: Parameters<typeof customInstance<ReadModeloRemuneracaoCatalogDto[]>>[1]
  ) =>
    customInstance<ReadModeloRemuneracaoCatalogDto[]>(
      { url: `${base}/modelos-remuneracao`, method: 'GET' },
      options
    );
  const listPoliticasBeneficio = (
    options?: Parameters<typeof customInstance<ReadPoliticaBeneficioCatalogDto[]>>[1]
  ) =>
    customInstance<ReadPoliticaBeneficioCatalogDto[]>(
      { url: `${base}/politicas-beneficio`, method: 'GET' },
      options
    );
  return { listModelosRemuneracao, listPoliticasBeneficio };
};
