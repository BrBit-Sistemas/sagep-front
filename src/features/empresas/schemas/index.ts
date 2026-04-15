import { z } from 'zod';

export const TIPO_EMPRESA_OPTIONS = [
  { value: 'PRIVADA', label: 'Empresa Privada' },
  { value: 'PUBLICA', label: 'Órgão Público' },
] as const;

export const createEmpresaSchema = z.object({
  razao_social: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(14, 'CNPJ deve ter 14 dígitos'),
  tipo: z.enum(['PRIVADA', 'PUBLICA'], { error: 'Tipo é obrigatório' }),
});

export type CreateEmpresaSchema = z.infer<typeof createEmpresaSchema>;

export type UpdateEmpresaSchema = CreateEmpresaSchema;
