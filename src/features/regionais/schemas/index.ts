import { z } from 'zod';

export const createRegionalSchema = z.object({
  secretariaId: z.string().uuid('ID da secretaria é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
});

export const updateRegionalSchema = createRegionalSchema.extend({
  id: z.string().uuid('ID da regional é obrigatório'),
});

export type CreateRegionalSchema = z.infer<typeof createRegionalSchema>;
export type UpdateRegionalSchema = z.infer<typeof updateRegionalSchema>;
