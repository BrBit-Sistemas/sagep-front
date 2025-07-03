import type { AuditableEntity } from 'src/types';

export type UnidadePrisional = {
  unidade_id: string;
  nome: string;
} & AuditableEntity;

export type UnidadePrisionalListParams = {
  page: number;
  limit: number;
  search?: string;
};
