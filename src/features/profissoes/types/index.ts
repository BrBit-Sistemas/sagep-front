import type { AuditableEntity } from 'src/types';

export type Profissao = {
  profissao_id: string;
  nome: string;
} & AuditableEntity;

export type ProfissaoListParams = {
  page: number;
  limit: number;
  search?: string;
};
