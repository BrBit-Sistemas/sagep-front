import { z } from 'zod';

export const createUnidadePrisionalSchema = z.object({
  nome: z
    .string()
    .min(3, 'O nome da unidade prisional deve ter no mínimo 3 caracteres')
    .max(255, 'O nome da unidade prisional deve ter no máximo 255 caracteres'),
  regionalId: z.string().uuid('Regional é obrigatório'),
});

export const updateUnidadePrisionalSchema = createUnidadePrisionalSchema.extend({
  id: z.string().uuid('ID da unidade prisional é obrigatório'),
});

export type CreateUnidadePrisionalSchema = z.infer<typeof createUnidadePrisionalSchema>;
export type UpdateUnidadePrisionalSchema = z.infer<typeof updateUnidadePrisionalSchema>;
