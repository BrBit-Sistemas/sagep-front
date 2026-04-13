import type {
  DetentoResumoDto,
  StatusValidacaoFicha,
  StatusOperacionalFicha,
  IndicadoresValidacaoDto,
} from 'src/api/fichas-cadastrais';

export type { DetentoResumoDto, StatusValidacaoFicha, StatusOperacionalFicha };

/**
 * Shape da linha da tabela e do dialog de detalhes.
 * Espelha `ReadFichaCadastralDto` do back-end, com os campos que de fato
 * consumimos nesta tela.
 */
export type FichaCadastralValidacao = {
  /** MUI DataGrid row id. */
  id: string;

  status: StatusOperacionalFicha | string;
  status_validacao: StatusValidacaoFicha;
  substatus_operacional: string | null;

  motivo_reprovacao: string | null;
  validado_em: string | null;
  validado_por: string | null;
  validado_por_nome: string | null;

  /** Dados da ficha denormalizados. */
  nome: string | null;
  cpf: string | null;
  regime: string | null;
  prontuario: string | null;
  unidade_prisional: string | null;
  artigos_penais: string[];

  /** Detento resumido (para fallback/identificação). */
  detento_id: string | null;
  detento: DetentoResumoDto | null;

  createdAt: string;
  updatedAt: string;
};

export type ValidacoesListParams = {
  page: number;
  limit: number;
  search?: string;
  status_validacao?: StatusValidacaoFicha | '';
  motivo_reprovacao?: string;
  detento_id?: string;
  cpf?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type ValidacoesMetrics = IndicadoresValidacaoDto;
