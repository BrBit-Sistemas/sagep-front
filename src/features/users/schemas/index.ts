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
  regionalId: z.union([z.string(), z.literal('')]).optional(),
  secretariaId: z.union([z.string(), z.literal('')]).optional(),
  unidadeId: z.union([z.string(), z.literal('')]).optional(),
  email: z
    .string()
    .min(1, { message: 'O email é obrigatório!' })
    .email({ message: 'O email deve ser um endereço de e-mail válido!' }),
});

export const createUserSchema = baseSchema
  .extend({
    senha: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' }).max(30, { message: 'A senha deve ter no máximo 30 caracteres!' }),
    confirmarSenha: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' }).max(30, { message: 'A senha deve ter no máximo 30 caracteres!' }),
  })
  .superRefine(({ senha, confirmarSenha }, ctx) => {
    if (senha !== confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem!',
        path: ['confirmarSenha'],
      });
    }
  });

export const updateUserSchema = baseSchema
  .extend({
    id: z.string().uuid('ID do usuário é obrigatório!'),
    senha: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' })
      .max(30, { message: 'A senha deve ter no máximo 30 caracteres!' })
      .or(z.literal('')),
    confirmarSenha: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' })
      .max(30, { message: 'A senha deve ter no máximo 30 caracteres!' })
      .or(z.literal('')),
  })
  .superRefine(({ senha, confirmarSenha }, ctx) => {
    if (senha !== confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem!',
        path: ['confirmarSenha'],
      });
    }
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
