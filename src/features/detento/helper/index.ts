import type { Detento } from '../types';
import type { CreateDetentoSchema } from '../schemas';

import { Regime, Escolaridade } from '../types';

export const detentoToFormValues = (detento: Detento): CreateDetentoSchema => ({
  nome: detento?.nome ?? '',
  prontuario: detento?.prontuario ?? '',
  cpf: detento?.cpf ?? '',
  data_nascimento: detento?.data_nascimento ?? '',
  regime: detento?.regime ?? Regime.FECHADO,
  escolaridade: detento?.escolaridade ?? Escolaridade.FUNDAMENTAL,
  unidade_id: detento?.unidade_id ?? '',
});
