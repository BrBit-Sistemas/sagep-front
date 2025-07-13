import type { AuditableEntity } from 'src/types';
import type { Regional } from 'src/features/regionais/types';

export type UnidadePrisional = {
  id: string;
  nome: string;
  regional: Regional;
} & AuditableEntity;

export type UnidadePrisionalListParams = {
  page: number;
  limit: number;
  search?: string;
};
