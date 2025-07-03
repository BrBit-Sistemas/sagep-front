import type { AuditableEntity } from 'src/types';

export type Empresa = {
  empresa_id: string;
  razao_social: string;
  cnpj: string;
} & AuditableEntity;

export type EmpresaListParams = {
  page: number;
  limit: number;
  search?: string;
};
