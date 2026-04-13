import { z } from 'zod';

const decisaoEnum = z.enum(['APROVADO', 'REPROVADO', 'ALERTA']);

export const validarFichaSchema = z
  .object({
    decisao: decisaoEnum,
    motivo_rejeicao: z.string().trim().optional(),
    observacao: z.string().trim().optional(),
    autorizacao_trabalho: z.boolean().optional(),
    seeu_consultado: z.boolean().optional(),
    siapen_consultado: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.decisao === 'REPROVADO') {
      const motivo = (val.motivo_rejeicao || '').trim();
      if (motivo.length < 3) {
        ctx.addIssue({
          code: 'custom',
          path: ['motivo_rejeicao'],
          message: 'Motivo é obrigatório ao reprovar (mínimo 3 caracteres).',
        });
      }
    }
  });

export type ValidarFichaSchema = z.infer<typeof validarFichaSchema>;

export const revalidarFichaSchema = z.object({
  motivo: z.string().trim().min(3, 'Motivo da revalidação é obrigatório (mín. 3 caracteres).'),
});

export type RevalidarFichaSchema = z.infer<typeof revalidarFichaSchema>;
