import type { StatusConvenio, ModalidadeExecucao } from '../types';

import { z } from 'zod';

export const modalidadesExecucao: ModalidadeExecucao[] = ['INTRAMUROS', 'EXTRAMUROS'];
export const statusConvenioValues: StatusConvenio[] = ['RASCUNHO', 'ATIVO', 'SUSPENSO', 'ENCERRADO'];

const toNumberArray = (val: unknown) => {
  if (Array.isArray(val)) return val.map((x) => Number(x)).filter((x) => !Number.isNaN(x));
  return [] as number[];
};

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
    .regex(/^\d{8}$/u, 'CEP deve conter 8 dígitos')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val : undefined)),
  referencia: z.string().optional().nullable(),
});

export const createEmpresaConvenioSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  tipo_codigo: z.string().min(1, 'Tipo é obrigatório'),
  modalidade_execucao: z.enum(modalidadesExecucao as [ModalidadeExecucao, ...ModalidadeExecucao[]]),
  regimes_permitidos: z
    .preprocess(toNumberArray, z.array(z.number()))
    .pipe(z.array(z.number()).min(1, 'Selecione ao menos um regime')),
  artigos_vedados: z.preprocess(toNumberArray, z.array(z.number())).default([]),
  quantitativos_profissoes: z
    .array(
      z.object({
        profissao_id: z.string().min(1, 'Profissão é obrigatória'),
        quantidade: z.number().int().positive('Quantidade deve ser positiva'),
      })
    )
    .optional()
    .default([]),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().optional().nullable(),
  status: z.enum(statusConvenioValues as [StatusConvenio, ...StatusConvenio[]]),
  observacoes: z.string().optional(),
  locais_execucao: z.array(localExecucaoSchema).optional().default([]),
});

export type CreateEmpresaConvenioSchema = z.infer<typeof createEmpresaConvenioSchema>;
export type UpdateEmpresaConvenioSchema = CreateEmpresaConvenioSchema;
export type EmpresaConvenioLocalSchema = z.infer<typeof localExecucaoSchema>;
