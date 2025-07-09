import type { CreateDetentoSchema, UpdateDetentoSchema } from '../schemas';
import type { CrudService, AuditableEntity, PaginatedParams } from 'src/types';

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
  detento_id: string;
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
  tem_problema_saude: boolean;
  regiao_bloqueada: string;
  ja_trabalhou_funap: boolean;
  ano_trabalho_anterior: number;
  pdf_path: string;
} & AuditableEntity;

export type DetentoService = {
  getFichasCadastrais: (detentoId: string) => Promise<DetentoFichaCadastral[]>;
} & CrudService<Detento, CreateDetentoSchema, UpdateDetentoSchema, PaginatedParams>;
