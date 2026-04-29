import { z } from 'zod';

export const TIPO_EMPRESA_OPTIONS = [
  { value: 'PRIVADA', label: 'Empresa Privada' },
  { value: 'PUBLICA', label: 'Órgão Público' },
] as const;

export const createEmpresaSchema = z.object({
  razao_social: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido (ex: 12.345.678/0001-99)'),
  tipo: z.enum(['PRIVADA', 'PUBLICA'], { error: 'Tipo é obrigatório' }),
  inscricao_estadual: z.string().optional(),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  logradouro_numero: z.string().min(1, 'Número é obrigatório').regex(/^[0-9\-/]+$/, 'Apenas dígitos, - e /'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP deve ter 8 dígitos (ex: 70040-020)'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().regex(/^[A-Za-z]{2}$/, 'UF deve ter 2 letras (ex: DF)'),
});

export type CreateEmpresaSchema = z.infer<typeof createEmpresaSchema>;

export type UpdateEmpresaSchema = CreateEmpresaSchema;
