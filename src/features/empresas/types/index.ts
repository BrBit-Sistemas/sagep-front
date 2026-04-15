import type { AuditableEntity } from 'src/types';

export type TipoEmpresa = 'PRIVADA' | 'PUBLICA';

export type Empresa = {
  id: string; // Campo necessário para MUI DataGrid
  empresa_id: string;
  razao_social: string;
  cnpj: string;
  tipo: TipoEmpresa;
} & AuditableEntity;

export type EmpresaListParams = {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};
