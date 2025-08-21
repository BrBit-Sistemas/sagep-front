import { z } from 'zod';

export const createProfissaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
  ativo: z.boolean().optional(),
});

export const updateProfissaoSchema = createProfissaoSchema.extend({
  id: z.string().uuid('ID da profissão é obrigatório'),
});

export type CreateProfissaoSchema = z.infer<typeof createProfissaoSchema>;
export type UpdateProfissaoSchema = z.infer<typeof updateProfissaoSchema>;
