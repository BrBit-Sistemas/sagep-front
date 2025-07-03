import { z } from 'zod';

import { Regime, Escolaridade } from '../types';

export const createDetentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  prontuario: z.string().min(1, 'Prontuário é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  regime: z.nativeEnum(Regime).default(Regime.FECHADO),
  escolaridade: z.nativeEnum(Escolaridade).default(Escolaridade.FUNDAMENTAL),
  unidade_id: z.string().min(1, 'Unidade é obrigatória'),
});

export type CreateDetentoSchema = z.infer<typeof createDetentoSchema>;

export type UpdateDetentoSchema = CreateDetentoSchema & { detentoId: string };
