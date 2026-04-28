import type { Empresa } from '../types';
import type { CreateEmpresaSchema } from '../schemas';

export const empresaToFormValues = (empresa: Empresa): CreateEmpresaSchema => ({
  razao_social: empresa?.razao_social ?? '',
  cnpj: empresa?.cnpj ?? '',
  tipo: empresa?.tipo ?? 'PRIVADA',
  inscricao_estadual: empresa?.inscricao_estadual ?? '',
  logradouro: empresa?.logradouro ?? '',
  logradouro_numero: empresa?.logradouro_numero ?? '',
  cep: empresa?.cep
    ? (() => {
        const raw = empresa.cep.replace(/\D/g, '');
        return raw.length === 8 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
      })()
    : '',
  cidade: empresa?.cidade ?? '',
  estado: empresa?.estado ?? '',
});
