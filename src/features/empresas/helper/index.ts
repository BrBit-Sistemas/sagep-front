import type { Empresa } from '../types';
import type { CreateEmpresaSchema } from '../schemas';

import { formatCepFromStorage, formatCnpjFromStorage } from 'src/utils/input-masks';

export const empresaToFormValues = (empresa: Empresa): CreateEmpresaSchema => ({
  razao_social: empresa?.razao_social ?? '',
  cnpj: formatCnpjFromStorage(empresa?.cnpj),
  tipo: empresa?.tipo ?? 'PRIVADA',
  inscricao_estadual: empresa?.inscricao_estadual ?? '',
  logradouro: empresa?.logradouro ?? '',
  logradouro_numero: empresa?.logradouro_numero ?? '',
  cep: formatCepFromStorage(empresa?.cep),
  cidade: empresa?.cidade ?? '',
  estado: empresa?.estado ?? '',
});
