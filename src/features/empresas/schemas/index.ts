import { z } from 'zod';

export const createEmpresaSchema = z.object({
  razao_social: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(14, 'CNPJ deve ter 14 dígitos'),
});

export type CreateEmpresaSchema = z.infer<typeof createEmpresaSchema>;

export type UpdateEmpresaSchema = CreateEmpresaSchema;
