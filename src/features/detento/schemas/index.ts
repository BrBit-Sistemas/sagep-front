import { z } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

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

export const createDetentoFichaCadastralSchema = z.object({
  detento_id: z.string().min(1, 'Detento é obrigatório'),
  tem_problema_saude: z.boolean().default(false),
  regiao_bloqueada: z.string().min(1, 'Região bloqueada é obrigatória'),
  ja_trabalhou_funap: z.boolean().default(false),
  ano_trabalho_anterior: z.number().min(1900, 'Ano de trabalho anterior deve ser maior que 1900'),
  pdf_path: schemaHelper.file({ message: 'PDF é obrigatório' }),
});

export type CreateDetentoSchema = z.infer<typeof createDetentoSchema>;
export type CreateDetentoFichaCadastralSchema = z.infer<typeof createDetentoFichaCadastralSchema>;

export type UpdateDetentoSchema = CreateDetentoSchema & {
  detentoId: string;
};

export type UpdateDetentoFichaCadastralSchema = CreateDetentoFichaCadastralSchema & {
  fichaCadastralId: string;
};
