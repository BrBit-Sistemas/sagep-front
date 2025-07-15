import { z } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

const baseSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório!' }),
  avatarUrl: schemaHelper.file({ required: false }),
  regionalId: z.string().optional(),
  secretariaId: z.string().optional(),
  unidadeId: z.string().optional(),
  email: z
    .string()
    .min(1, { message: 'O email é obrigatório!' })
    .email({ message: 'O email deve ser um endereço de e-mail válido!' }),
});

export const createUserSchema = baseSchema
  .extend({
    senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
    confirmarSenha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
  })
  .superRefine(({ senha, confirmarSenha, unidadeId, regionalId, secretariaId }, ctx) => {
    if (senha !== confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem!',
        path: ['confirmarSenha'],
      });
    }

    if (!unidadeId && !regionalId && !secretariaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pelo menos um campo de (Secretaria, Regional ou Unidade) é obrigatório!',
        path: ['unidadeId', 'regionalId', 'secretariaId'],
      });
    }
  });

export const updateUserSchema = baseSchema
  .extend({
    id: z.string().uuid('ID do usuário é obrigatório!'),
    senha: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' })
      .or(z.literal('')),
    confirmarSenha: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' })
      .or(z.literal('')),
  })
  .superRefine(({ senha, confirmarSenha, unidadeId, regionalId, secretariaId }, ctx) => {
    if (senha !== confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem!',
        path: ['confirmarSenha'],
      });
    }

    if (!unidadeId && !regionalId && !secretariaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pelo menos um campo de (Secretaria, Regional ou Unidade) é obrigatório!',
        path: ['unidadeId', 'regionalId', 'secretariaId'],
      });
    }
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
