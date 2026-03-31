import type { ModalidadeExecucao } from '../types';

import { z } from 'zod';

export const modalidadesExecucao: ModalidadeExecucao[] = ['INTRAMUROS', 'EXTRAMUROS'];

const toOptionalInt = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(z.number().int().min(1).optional());

const optionalPercent = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(z.number().min(0).max(100).optional());

const localExecucaoSchema = z.object({
  local_id: z.string().uuid().optional(),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().optional().nullable(),
  complemento: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z
    .string()
    .min(2, 'UF deve ter 2 caracteres')
    .max(2, 'UF deve ter 2 caracteres')
    .transform((val) => val.toUpperCase()),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/u, 'CEP deve conter 8 dígitos')
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val) return undefined;
      return val.replace(/\D/g, '');
    }),
  referencia: z.string().optional().nullable(),
});

export const createEmpresaConvenioSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  modalidade_execucao: z.enum(modalidadesExecucao as [ModalidadeExecucao, ...ModalidadeExecucao[]]),
  regimes_permitidos: z
    .array(z.union([z.number(), z.string()]))
    .transform((arr) =>
      arr.map((x) => Number(x)).filter((n) => !Number.isNaN(n))
    )
    .pipe(z.array(z.number()).min(1, 'Selecione ao menos um regime')),
  artigos_vedados: z.array(z.string()).default([]),
  max_reeducandos: toOptionalInt,
  permite_variacao_quantidade: z.boolean().default(true),
  modelo_remuneracao_id: z.string().uuid('Modelo de remuneração é obrigatório'),
  politica_beneficio_id: z.string().uuid('Política de benefício é obrigatória'),
  permite_bonus_produtividade: z.boolean().default(false),
  percentual_gestao: optionalPercent,
  percentual_contrapartida: optionalPercent,
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().optional().nullable(),
  observacoes: z.string().optional(),
  locais_execucao: z.array(localExecucaoSchema).optional().default([]),
});

export type CreateEmpresaConvenioFormValues = z.input<typeof createEmpresaConvenioSchema>;
export type CreateEmpresaConvenioSchema = z.output<typeof createEmpresaConvenioSchema>;
export type UpdateEmpresaConvenioSchema = CreateEmpresaConvenioSchema;
export type EmpresaConvenioLocalSchema = z.infer<typeof localExecucaoSchema>;
