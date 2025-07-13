import { z } from 'zod';

export const createSecretariaSchema = z.object({
  nome: z
    .string()
    .min(3, 'O nome da secretaria deve ter no mínimo 3 caracteres')
    .max(255, 'O nome da secretaria deve ter no máximo 255 caracteres'),
});

export const updateSecretariaSchema = createSecretariaSchema.extend({
  secretariaId: z.string().uuid('ID da secretaria é obrigatório'),
});

export type CreateSecretariaSchema = z.infer<typeof createSecretariaSchema>;
export type UpdateSecretariaSchema = z.infer<typeof updateSecretariaSchema>;
