import { z } from 'zod';

export const createProfissaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export type CreateProfissaoSchema = z.infer<typeof createProfissaoSchema>;

export type UpdateProfissaoSchema = CreateProfissaoSchema;
