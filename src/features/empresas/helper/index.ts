import type { Empresa } from '../types';
import type { CreateEmpresaSchema } from '../schemas';

export const empresaToFormValues = (empresa: Empresa): CreateEmpresaSchema => ({
  razao_social: empresa?.razao_social ?? '',
  cnpj: empresa?.cnpj ?? '',
  tipo: empresa?.tipo ?? 'PRIVADA',
  inscricao_estadual: empresa?.inscricao_estadual ?? '',
  logradouro: empresa?.logradouro ?? '',
  logradouro_numero: empresa?.logradouro_numero ?? '',
  cep: empresa?.cep ? empresa.cep.replace(/\D/g, '') : '',
  cidade: empresa?.cidade ?? '',
  estado: empresa?.estado ?? '',
});
