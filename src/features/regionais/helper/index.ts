import type { Regional } from '../types';

export const regionalToFormValues = (regional: Regional) => ({
  nome: regional.nome,
  secretariaId: regional.secretariaId,
});
