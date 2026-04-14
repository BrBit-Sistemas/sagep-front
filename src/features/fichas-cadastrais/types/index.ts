import type {
  DetentoResumoDto,
  StatusValidacaoFicha,
  StatusOperacionalFicha,
  IndicadoresValidacaoDto,
} from 'src/api/fichas-cadastrais';

export type { DetentoResumoDto, StatusValidacaoFicha, StatusOperacionalFicha };

export type FichaCadastral = {
  id: string;
  status: StatusOperacionalFicha | string;
  status_validacao: StatusValidacaoFicha;
  substatus_operacional: string | null;
  motivo_reprovacao: string | null;
  validado_em: string | null;
  validado_por: string | null;
  validado_por_nome: string | null;
  nome: string | null;
  cpf: string | null;
  regime: string | null;
  prontuario: string | null;
  unidade_prisional: string | null;
  artigos_penais: string[];
  detento_id: string | null;
  detento: DetentoResumoDto | null;
  createdAt: string;
  updatedAt: string;
};

export type FichasCadastraisListParams = {
  page: number;
  limit: number;
  search?: string;
  status_validacao?: StatusValidacaoFicha | '';
  cpf?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type FichasCadastraisMetrics = IndicadoresValidacaoDto;
