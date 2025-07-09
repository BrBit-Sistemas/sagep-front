import type { Detento, DetentoFichaCadastral } from '../types';
import type { CreateDetentoSchema, CreateDetentoFichaCadastralSchema } from '../schemas';

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

export const fichaCadastralToFormValues = (
  fichaCadastral: DetentoFichaCadastral
): CreateDetentoFichaCadastralSchema => ({
  detento_id: fichaCadastral.detento_id ?? '',
  pdf_path: fichaCadastral.pdf_path ?? '',
  tem_problema_saude: fichaCadastral.tem_problema_saude ?? false,
  regiao_bloqueada: fichaCadastral.regiao_bloqueada ?? '',
  ja_trabalhou_funap: fichaCadastral.ja_trabalhou_funap ?? false,
  ano_trabalho_anterior: fichaCadastral.ano_trabalho_anterior ?? 0,
});
