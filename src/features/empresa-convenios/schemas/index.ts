import type { StatusConvenio, ModalidadeExecucao } from '../types';

import { z } from 'zod';

export const modalidadesExecucao: ModalidadeExecucao[] = ['INTRAMUROS', 'EXTRAMUROS'];
export const statusConvenioValues: StatusConvenio[] = ['RASCUNHO', 'ATIVO', 'SUSPENSO', 'ENCERRADO'];

const toNumberArray = (val: unknown) => {
  if (Array.isArray(val)) return val.map((x) => Number(x)).filter((x) => !Number.isNaN(x));
  return [] as number[];
};

export const createEmpresaConvenioSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  tipo_codigo: z.string().min(1, 'Tipo é obrigatório'),
  modalidade_execucao: z.enum(modalidadesExecucao as [ModalidadeExecucao, ...ModalidadeExecucao[]]),
  regimes_permitidos: z
    .preprocess(toNumberArray, z.array(z.number()))
    .pipe(z.array(z.number()).min(1, 'Selecione ao menos um regime')),
  artigos_vedados: z.preprocess(toNumberArray, z.array(z.number())).default([]),
  quantitativo_maximo: z
    .union([z.number().int().positive(), z.null()])
    .optional()
    .nullable(),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().optional().nullable(),
  status: z.enum(statusConvenioValues as [StatusConvenio, ...StatusConvenio[]]),
  observacoes: z.string().optional(),
});

export type CreateEmpresaConvenioSchema = z.infer<typeof createEmpresaConvenioSchema>;
export type UpdateEmpresaConvenioSchema = CreateEmpresaConvenioSchema;
