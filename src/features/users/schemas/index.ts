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
  whatsappNumero: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => {
        const digits = (value || '').replace(/\D/g, '');
        return digits.length === 0 || /^[0-9]{10,15}$/.test(digits);
      },
      {
        message: 'O número de WhatsApp deve conter entre 10 e 15 dígitos',
      }
    ),
  whatsappNotificacoes: z.boolean().default(true),
  emailNotificacoes: z.boolean().default(true),
});

export const createUserSchema = baseSchema
  .extend({
    senha: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' }).max(30, { message: 'A senha deve ter no máximo 30 caracteres!' }),
    confirmarSenha: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' }).max(30, { message: 'A senha deve ter no máximo 30 caracteres!' }),
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
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' })
      .max(30, { message: 'A senha deve ter no máximo 30 caracteres!' })
      .or(z.literal('')),
    confirmarSenha: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' })
      .max(30, { message: 'A senha deve ter no máximo 30 caracteres!' })
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
