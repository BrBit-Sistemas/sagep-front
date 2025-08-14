import type { CrudService, AuditableEntity, PaginatedParams } from 'src/types';
import type {
  CreateDetentoSchema,
  UpdateDetentoSchema,
  CreateDetentoFichaCadastralSchema,
} from '../schemas';

export enum Regime {
  FECHADO = 'FECHADO',
  SEMIABERTO = 'SEMIABERTO',
  ABERTO = 'ABERTO',
}

export enum Escolaridade {
  FUNDAMENTAL = 'FUNDAMENTAL',
  MEDIO = 'MEDIO',
  SUPERIOR = 'SUPERIOR',
  ANALFABETO = 'ANALFABETO',
}

export type Detento = {
  id: string;
  nome: string;
  prontuario: string;
  cpf: string;
  data_nascimento: string;
  regime: Regime;
  escolaridade: Escolaridade;
  unidade_id: string;
} & AuditableEntity;

export type DetentoListParams = {
  page: number;
  limit: number;
  search?: string;
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
  prontuario: string;
  sei: string;
  planilha: string;
  cidade_processo: string;
  // Endereço e contato
  endereco: string;
  regiao_administrativa: string;
  telefone: string;
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
  // Declarações e responsáveis
  declaracao_veracidade: boolean;
  responsavel_preenchimento: string;
  assinatura: string;
  data_assinatura: string;
  site_codigo: string;
  // Metadados do formulário
  rodape_num_1: string;
  rodape_num_2: string;
  rodape_sei: string;
  // PDF gerado
  pdf_path: string;
} & AuditableEntity;

export type DetentoService = {
  getFichasCadastrais: (detentoId: string) => Promise<DetentoFichaCadastral[]>;
  createFichaCadastral: (data: CreateDetentoFichaCadastralSchema) => Promise<any>;
  updateFichaCadastral: (
    fichacadastral_id: string,
    data: CreateDetentoFichaCadastralSchema
  ) => Promise<any>;
  deleteFichaCadastral: (fichacadastral_id: string) => Promise<any>;
  getFichaCadastralPdfUrl: (fichacadastral_id: string) => Promise<string>;
} & CrudService<Detento, CreateDetentoSchema, UpdateDetentoSchema, PaginatedParams>;
