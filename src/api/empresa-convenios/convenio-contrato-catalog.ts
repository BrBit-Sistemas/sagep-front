import { customInstance } from '../../lib/axios';

export type CodigoTemplateContrato =
  | 'PADRAO_FUNAP'
  | 'PADRAO_FUNAP_BENEFICIOS_CONTRATANTE'
  | 'PADRAO_BONIFICACAO'
  | 'PADRAO_INTRAMUROS'
  | 'PADRAO_ORGAO_PUBLICO_GDF';

export type ReadTemplateContratoDto = {
  template_contrato_id: string;
  codigo: CodigoTemplateContrato;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
};

export type ReadTabelaProdutividadeItemDto = {
  tabela_produtividade_item_id: string;
  codigo_ou_faixa: string;
  descricao?: string | null;
  percentual_ou_valor: number;
  ordem: number;
};

export type ReadTabelaProdutividadeDto = {
  tabela_produtividade_id: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  itens: ReadTabelaProdutividadeItemDto[];
};

export const getConvenioContratoCatalog = () => {
  const base = '/empresa-convenios/catalog';

  const listTemplates = (
    options?: Parameters<typeof customInstance<ReadTemplateContratoDto[]>>[1]
  ) =>
    customInstance<ReadTemplateContratoDto[]>(
      { url: `${base}/template-contratos`, method: 'GET' },
      options
    );

  const listTabelasProdutividade = (
    options?: Parameters<typeof customInstance<ReadTabelaProdutividadeDto[]>>[1]
  ) =>
    customInstance<ReadTabelaProdutividadeDto[]>(
      { url: `${base}/tabelas-produtividade`, method: 'GET' },
      options
    );

  const getTabelaProdutividade = (
    id: string,
    options?: Parameters<typeof customInstance<ReadTabelaProdutividadeDto>>[1]
  ) =>
    customInstance<ReadTabelaProdutividadeDto>({
      url: `${base}/tabelas-produtividade/${id}`,
      method: 'GET',
    }, options);

  return { listTemplates, listTabelasProdutividade, getTabelaProdutividade };
};
