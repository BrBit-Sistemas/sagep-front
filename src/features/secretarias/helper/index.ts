import type { CreateSecretariaSchema } from '../schemas';
import type { Secretaria } from 'src/api/generated.schemas';

export const secretariaToFormValues = (secretaria: Secretaria): CreateSecretariaSchema => ({
  nome: secretaria.nome,
});
