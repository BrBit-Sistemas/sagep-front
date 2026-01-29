import type { CrudService, AuditableEntity } from 'src/types';
import type { Regime, Escolaridade } from 'src/types/prisional';
import type {
  CreateDetentoSchema,
  UpdateDetentoSchema,
  CreateDetentoFichaCadastralSchema,
} from '../schemas';

// Re-export dos enums centralizados para compatibilidade
export { Regime, Escolaridade };

export type Detento = {
  id: string;
  nome: string;
  mae?: string;
  prontuario?: string | null;
  cpf: string;
  data_nascimento: string;
  regime: Regime;
  escolaridade: Escolaridade;
  unidade_id: string;
  ficha_cadastral_created_at?: string | null;
  ficha_cadastral_created_by_name?: string | null;
  status_validacao?: string | null;
} & AuditableEntity;

export type DetentoListParams = {
  page: number;
  limit: number;
  search?: string;
  cpf?: string;
};

export type DetentoFichaCadastral = {
  fichacadastral_id: string;
  detento_id: string;
  // Identificação pessoal
  nome: string;
  cpf: string;
  rg: string;
  rg_expedicao: string;
  rg_orgao_uf: string;
  data_nascimento: string;
  naturalidade: string;
  naturalidade_uf: string;
  filiacao_mae: string;
  filiacao_pai: string;
  // Situação prisional
  regime: string;
  unidade_prisional: string;
  prontuario?: string | null;
  sei: string;
  // Endereço e contato (campos antigos - compatibilidade)
  endereco?: string;
  regiao_administrativa?: string;
  telefone?: string;

  // Novos campos de endereço estruturados
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  // Região Administrativa (específico para DF)
  ra_df?: string;
  // Escolaridade
  escolaridade: string;
  // Saúde
  tem_problema_saude: boolean;
  problema_saude: string;
  // Restrições de trabalho
  regiao_bloqueada: string;
  // Experiência e qualificação
  experiencia_profissional: string;
  fez_curso_sistema_prisional: string;
  ja_trabalhou_funap: boolean;
  ano_trabalho_anterior: string;
  profissao_01: string;
  profissao_02: string;
  artigos_penais?: (string | number)[];
  // Declarações e responsáveis
  responsavel_preenchimento: string;
  assinatura: string;
  data_assinatura: string;
  // PDF gerado
  pdf_path: string;
  status?: 'ativa' | 'inativa';
  status_validacao?: string;
  substatus_operacional?: string | null;
  documentos?: DetentoFichaDocumento[];
} & AuditableEntity;

export type DetentoFichaDocumento = {
  id: string;
  ficha_cadastral_id: string;
  nome: string;
  s3_key: string;
  mime_type: string;
  file_size: number;
  url?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type DetentoService = {
  getFichasCadastrais: (detentoId: string) => Promise<DetentoFichaCadastral[]>;
  createFichaCadastral: (data: CreateDetentoFichaCadastralSchema) => Promise<any>;
  updateFichaCadastral: (
    fichacadastral_id: string,
    data: CreateDetentoFichaCadastralSchema
  ) => Promise<any>;
  deleteFichaCadastral: (fichacadastral_id: string) => Promise<any>;
  getFichaCadastralPdfUrl: (fichacadastral_id: string) => Promise<string>;
} & CrudService<Detento, CreateDetentoSchema, UpdateDetentoSchema, DetentoListParams>;
