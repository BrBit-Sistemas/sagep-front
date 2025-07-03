import type { Empresa } from '../types';
import type { CreateEmpresaSchema } from '../schemas';

export const empresaToFormValues = (empresa: Empresa): CreateEmpresaSchema => ({
  razao_social: empresa?.razao_social ?? '',
  cnpj: empresa?.cnpj ?? '',
});
