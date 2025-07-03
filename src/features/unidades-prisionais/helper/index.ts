import type { UnidadePrisional } from '../types';
import type { CreateUnidadePrisionalSchema } from '../schemas';

export const unidadePrisionalToFormValues = (
  unidade: UnidadePrisional
): CreateUnidadePrisionalSchema => ({
  nome: unidade?.nome ?? '',
});
