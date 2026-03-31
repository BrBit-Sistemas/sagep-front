import type { AuditableEntity } from 'src/types';
import type { CodigoTemplateContrato } from 'src/api/empresa-convenios/convenio-contrato-catalog';

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

export type ConvenioQuantidadeNivel = {
  convenio_quantidade_nivel_id?: string;
  nivel: 'I' | 'II' | 'III';
  quantidade: number;
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
  modelo_remuneracao_id: string;
  politica_beneficio_id: string;
  permite_bonus_produtividade: boolean;
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
  quantidades_nivel?: ConvenioQuantidadeNivel[];
} & AuditableEntity;

export type EmpresaConvenioListParams = {
  page: number;
  limit: number;
  search?: string;
};
