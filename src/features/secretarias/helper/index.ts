import type { Secretaria } from 'src/api/generated';
import type { CreateSecretariaSchema } from '../schemas';

export const secretariaToFormValues = (secretaria: Secretaria): CreateSecretariaSchema => ({
  nome: secretaria.nome,
});
