import { z } from 'zod';

import { isValidRg } from 'src/utils/validate-rg';
import { isValidCpf } from 'src/utils/validate-cpf';

import { Regime, Escolaridade } from '../types';

export const createDetentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  mae: z.string().optional(),
  prontuario: z.string().optional(),
  cpf: z
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF inválido')
    .refine((value) => isValidCpf(value), 'CPF inválido'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  regime: z.nativeEnum(Regime).default(Regime.FECHADO),
  escolaridade: z.nativeEnum(Escolaridade).default(Escolaridade.FUNDAMENTAL_I_INCOMPLETO),
  unidade_id: z.string().min(1, 'Unidade é obrigatória'),
});

export const createDetentoFichaCadastralSchema = z.object({
  detento_id: z.string().min(1, 'ID do detento é obrigatório'),
  // Identificação pessoal
  nome: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine((value) => isValidCpf(value), 'CPF inválido'),
  rg: z
    .string()
    .min(1, 'RG é obrigatório')
    .refine((value) => isValidRg(value), 'RG inválido'),
  rg_expedicao: z.string().min(1, 'Data de expedição é obrigatória'),
  rg_orgao_uf: z.string().min(1, 'Órgão expedidor/UF é obrigatório'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  naturalidade: z.string().min(1, 'Naturalidade é obrigatória'),
  naturalidade_uf: z.string().min(1, 'UF de naturalidade é obrigatória'),
  filiacao_mae: z.string().min(1, 'Nome da mãe é obrigatório'),
  filiacao_pai: z.string().optional(),
  // Situação prisional
  regime: z.string().min(1, 'Regime é obrigatório'),
  unidade_prisional: z.string().min(1, 'Unidade prisional é obrigatória'),
  prontuario: z.string().optional(),
  sei: z.string().optional(),
  // Endereço e contato
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  regiao_administrativa: z.string().min(1, 'Região Administrativa é obrigatória'),
  telefone: z.string().optional(),
  // Escolaridade
  escolaridade: z.string().min(1, 'Escolaridade é obrigatória'),
  // Saúde
  tem_problema_saude: z.boolean().default(false),
  problema_saude: z.string().optional(),
  // Restrições de trabalho
  regiao_bloqueada: z.string().optional(),
  // Experiência e qualificação
  experiencia_profissional: z.string().optional(),
  fez_curso_sistema_prisional: z.string().optional(),
  ja_trabalhou_funap: z.boolean().default(false),
  ano_trabalho_anterior: z.string().optional(),
  profissao_01: z.string().optional(),
  profissao_02: z.string().optional(),
  // Declarações e responsáveis
  responsavel_preenchimento: z.string().optional(),
  assinatura: z.string().optional(),
  data_assinatura: z.string().optional(),
  // PDF gerado
  pdf_path: z.string().optional(),
  // Documentos anexados
  documentos: z
    .array(
      z.object({
        id: z.string().optional(),
        nome: z.string().min(1, 'Informe o nome do documento'),
        s3_key: z.string().min(1),
        mime_type: z.string().min(1),
        file_size: z.number().min(1),
        url: z.string().optional(),
        previewUrl: z.string().optional(),
      })
    )
    .min(1, 'Anexe ao menos um documento em imagem')
    .superRefine((docs, ctx) => {
      const hasImage = docs.some((doc) => doc.mime_type?.startsWith('image/'));
      if (!hasImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Envie pelo menos uma imagem.',
        });
      }
    }),
});

export type CreateDetentoSchema = z.infer<typeof createDetentoSchema>;
export type CreateDetentoFichaCadastralSchema = z.infer<typeof createDetentoFichaCadastralSchema>;

export type UpdateDetentoSchema = CreateDetentoSchema & {
  detentoId: string;
};

export type UpdateDetentoFichaCadastralSchema = CreateDetentoFichaCadastralSchema & {
  fichaCadastralId: string;
};
