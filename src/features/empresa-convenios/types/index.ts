import type { AuditableEntity } from 'src/types';
import type { CodigoTemplateContrato } from 'src/api/empresa-convenios/convenio-contrato-catalog';
import type {
  ResponsavelBeneficio,
  TipoCalculoRemuneracao,
} from 'src/api/empresa-convenios/convenio-enums';

export type ModalidadeExecucao = 'INTRAMUROS' | 'EXTRAMUROS';

export type EmpresaConvenioLocal = {
  local_id: string;
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade: string;
  estado: string;
  cep?: string | null;
  referencia?: string | null;
};

export type ConvenioResponsavel = {
  convenio_responsavel_id?: string;
  tipo: 'REPRESENTANTE_LEGAL' | 'PREPOSTO_OPERACIONAL';
  nome: string;
  cargo?: string | null;
  documento?: string | null;
  email?: string | null;
  telefone?: string | null;
};

export type ConvenioDistribuicaoProfissao = {
  convenio_vaga_id: string;
  profissao_id: string;
  profissao_nome?: string;
  quantidade: number;
  nivel?: 'I' | 'II' | 'III' | null;
  observacao?: string;
};

export type EmpresaConvenio = {
  id: string;
  convenio_id: string;
  empresa_id: string;
  modalidade_execucao: ModalidadeExecucao;
  regimes_permitidos: number[];
  artigos_vedados: string[];
  max_reeducandos?: number | null;
  permite_variacao_quantidade: boolean;
  data_inicio: string;
  data_fim?: string | null;
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
  quantidade_nivel_i?: number | null;
  quantidade_nivel_ii?: number | null;
  quantidade_nivel_iii?: number | null;
  permite_bonus_produtividade: boolean;
  bonus_produtividade_descricao?: string | null;
  bonus_produtividade_tabela_json?: Record<string, unknown>[] | null;
  percentual_gestao?: number | null;
  percentual_contrapartida?: number | null;
  observacoes?: string;
  locais_execucao?: EmpresaConvenioLocal[];
  template_contrato_id: string;
  template_codigo?: CodigoTemplateContrato | null;
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
  tabela_produtividade_id?: string | null;
  responsaveis?: ConvenioResponsavel[];
  distribuicao_profissoes?: ConvenioDistribuicaoProfissao[];
} & AuditableEntity;

export type EmpresaConvenioListParams = {
  page: number;
  limit: number;
  search?: string;
};
