import type { ResponsavelBeneficio, TipoCalculoRemuneracao } from './convenio-enums';
import type {
  CodigoTemplateContrato,
  ReadTemplateContratoDto,
  ReadTabelaProdutividadeDto,
} from './convenio-contrato-catalog';

import { type BodyType, customInstance } from '../../lib/axios';

export type EmpresaConvenioLocalDto = {
  local_id?: string;
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade: string;
  estado: string;
  cep?: string | null;
  referencia?: string | null;
};

export type CreateConvenioResponsavelDto = {
  tipo: 'REPRESENTANTE_LEGAL' | 'PREPOSTO_OPERACIONAL';
  nome: string;
  cargo?: string;
  documento?: string;
  email?: string;
  telefone?: string;
};

export type CreateConvenioDistribuicaoProfissaoDto = {
  profissao_id: string;
  quantidade: number;
  nivel?: 'I' | 'II' | 'III' | null;
  observacao?: string;
};

export type ReadConvenioDistribuicaoProfissaoDto = CreateConvenioDistribuicaoProfissaoDto & {
  convenio_vaga_id: string;
  profissao_nome?: string;
};

export type CreateEmpresaConvenioDto = {
  empresa_id: string;
  modalidade_execucao: 'INTRAMUROS' | 'EXTRAMUROS';
  regimes_permitidos: number[];
  artigos_vedados?: string[];
  max_reeducandos?: number;
  permite_variacao_quantidade?: boolean;
  data_inicio: string;
  data_fim?: string | null;
  tipo_calculo_remuneracao: TipoCalculoRemuneracao;
  usa_nivel: boolean;
  valor_nivel_i?: number;
  valor_nivel_ii?: number;
  valor_nivel_iii?: number;
  transporte_responsavel: ResponsavelBeneficio;
  alimentacao_responsavel: ResponsavelBeneficio;
  valor_transporte: number;
  valor_alimentacao: number;
  beneficio_variavel_por_dia: boolean;
  observacao_beneficio?: string;
  quantidade_nivel_i?: number;
  quantidade_nivel_ii?: number;
  quantidade_nivel_iii?: number;
  permite_bonus_produtividade?: boolean;
  bonus_produtividade_descricao?: string;
  bonus_produtividade_tabela_json?: Record<string, unknown>[];
  percentual_gestao?: number | null;
  percentual_contrapartida?: number | null;
  observacoes?: string;
  numero_contrato?: string;
  processo_sei?: string;
  doc_sei?: string;
  siggo_numero?: string;
  locais_execucao?: EmpresaConvenioLocalDto[];
  template_contrato_id: string;
  jornada_tipo?: string;
  carga_horaria_semanal?: number;
  escala?: string;
  horario_inicio?: string | null;
  horario_fim?: string | null;
  possui_seguro_acidente?: boolean;
  tipo_cobertura_seguro?: string;
  observacao_seguro?: string;
  observacao_juridica?: string;
  clausula_adicional?: string;
  descricao_complementar_objeto?: string;
  observacao_operacional?: string;
  tabela_produtividade_id?: string;
  responsaveis?: CreateConvenioResponsavelDto[];
  distribuicao_profissoes?: CreateConvenioDistribuicaoProfissaoDto[];
};

export type UpdateEmpresaConvenioDto = Partial<CreateEmpresaConvenioDto> & {
  locais_execucao?: EmpresaConvenioLocalDto[];
};

export type ReadConvenioResponsavelDto = CreateConvenioResponsavelDto & {
  convenio_responsavel_id: string;
};

export type ReadEmpresaConvenioDto = Omit<
  CreateEmpresaConvenioDto,
  'distribuicao_profissoes' | 'responsaveis' | 'locais_execucao'
> & {
  convenio_id: string;
  createdAt: string;
  updatedAt: string;
  locais_execucao?: (EmpresaConvenioLocalDto & { local_id: string })[];
  template_codigo?: CodigoTemplateContrato | null;
  responsaveis?: ReadConvenioResponsavelDto[];
  distribuicao_profissoes?: ReadConvenioDistribuicaoProfissaoDto[];
};

export type ContratoPreviewRemuneracaoBeneficiosDto = {
  tipo_calculo_remuneracao: TipoCalculoRemuneracao;
  usa_nivel: boolean;
  valor_nivel_i?: number | null;
  valor_nivel_ii?: number | null;
  valor_nivel_iii?: number | null;
  transporte_responsavel: ResponsavelBeneficio;
  alimentacao_responsavel: ResponsavelBeneficio;
  valor_transporte: number;
  valor_alimentacao: number;
  beneficio_variavel_por_dia: boolean;
  observacao_beneficio?: string | null;
};

export type ContratoPreviewDto = {
  convenio_id: string;
  template: ReadTemplateContratoDto;
  template_codigo: CodigoTemplateContrato;
  empresa: { empresa_id: string; razao_social: string; cnpj: string };
  modalidade_execucao: string;
  regimes_permitidos: number[];
  artigos_vedados: string[];
  max_reeducandos?: number | null;
  permite_variacao_quantidade: boolean;
  quantidade_nivel_i?: number | null;
  quantidade_nivel_ii?: number | null;
  quantidade_nivel_iii?: number | null;
  jornada_tipo?: string | null;
  carga_horaria_semanal?: number | null;
  escala?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
  possui_seguro_acidente: boolean;
  tipo_cobertura_seguro?: string | null;
  observacao_seguro?: string | null;
  observacao_juridica?: string | null;
  clausula_adicional?: string | null;
  descricao_complementar_objeto?: string | null;
  observacao_operacional?: string | null;
  observacoes?: string | null;
  numero_contrato?: string | null;
  processo_sei?: string | null;
  doc_sei?: string | null;
  siggo_numero?: string | null;
  data_inicio: string;
  data_fim?: string | null;
  remuneracao_beneficios: ContratoPreviewRemuneracaoBeneficiosDto;
  permite_bonus_produtividade: boolean;
  bonus_produtividade_descricao?: string | null;
  bonus_produtividade_tabela_json?: Record<string, unknown>[] | null;
  tabela_produtividade?: ReadTabelaProdutividadeDto | null;
  percentual_gestao?: number | null;
  percentual_contrapartida?: number | null;
  responsaveis: ReadConvenioResponsavelDto[];
  locais_execucao: (EmpresaConvenioLocalDto & { local_id: string })[];
  distribuicao_profissoes: ReadConvenioDistribuicaoProfissaoDto[];
};

export type GerarContratoPdfResponseDto = {
  url: string;
  filename: string;
  pdf_id: string;
};

export type PaginateEmpresaConvenioDto = {
  items: ReadEmpresaConvenioDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ListParams = { page?: number; limit?: number; search?: string };

export const getEmpresaConvenios = () => {
  const base = '/empresa-convenios';

  const create = (
    body: BodyType<CreateEmpresaConvenioDto>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<ReadEmpresaConvenioDto>(
      { url: base, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: body },
      options
    );

  const findAll = (params?: ListParams, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<PaginateEmpresaConvenioDto>({ url: base, method: 'GET', params }, options);

  const findOne = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<ReadEmpresaConvenioDto>({ url: `${base}/${id}`, method: 'GET' }, options);

  const getContratoPreview = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<ContratoPreviewDto>(
      { url: `${base}/${id}/contrato-preview`, method: 'GET' },
      options
    );

  const gerarContratoPdf = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<GerarContratoPdfResponseDto>(
      { url: `${base}/${id}/gerar-contrato-pdf`, method: 'POST' },
      options
    );

  const update = (
    id: string,
    body: BodyType<UpdateEmpresaConvenioDto>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<ReadEmpresaConvenioDto>(
      {
        url: `${base}/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  const remove = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<void>({ url: `${base}/${id}`, method: 'DELETE' }, options);

  return { create, findAll, findOne, getContratoPreview, gerarContratoPdf, update, remove };
};
