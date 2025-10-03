import { z } from 'zod';

import { isValidCpf } from 'src/utils/validate-cpf';

import { schemaHelper } from 'src/components/hook-form';

const baseSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório!' }),
  cpf: z
    .string()
    .min(1, { message: 'O CPF é obrigatório!' })
    .length(11, { message: 'O CPF deve ter 11 dígitos' })
    .refine((value) => isValidCpf(value), { message: 'CPF inválido' }),
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
  .superRefine(({ senha, confirmarSenha, secretariaId }, ctx) => {
    if (senha !== confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem!',
        path: ['confirmarSenha'],
      });
    }

    if (!secretariaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O campo Secretaria é obrigatório!',
        path: ['secretariaId'],
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
  .superRefine(({ senha, confirmarSenha, secretariaId }, ctx) => {
    if (senha !== confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem!',
        path: ['confirmarSenha'],
      });
    }

    if (!secretariaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O campo Secretaria é obrigatório!',
        path: ['secretariaId'],
      });
    }
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
