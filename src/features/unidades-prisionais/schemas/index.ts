import { z } from 'zod';

export const createUnidadePrisionalSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export type CreateUnidadePrisionalSchema = z.infer<typeof createUnidadePrisionalSchema>;

export type UpdateUnidadePrisionalSchema = CreateUnidadePrisionalSchema;
