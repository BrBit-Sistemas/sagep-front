import { z } from 'zod';

import { isValidCpf } from 'src/utils/validate-cpf';

import { Regime, Escolaridade } from 'src/types/prisional';

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

export const createDetentoFichaCadastralBaseSchema = z.object({
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
    .refine((value) => {
      const rg = value.trim();
      return rg.length >= 3 && rg.length <= 15;
    }, 'RG deve ter entre 3 e 15 caracteres'),
  rg_expedicao: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Data de expedição do RG deve estar no formato YYYY-MM-DD',
    }),
  rg_orgao_uf: z.string().min(1, 'Órgão e UF do RG são obrigatórios'),
  data_nascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Data deve estar no formato YYYY-MM-DD',
    }),
  naturalidade: z.string().min(1, 'Naturalidade é obrigatória'),
  naturalidade_uf: z
    .string()
    .min(1, 'UF de naturalidade é obrigatória')
    .refine((value) => /^[A-Z]{2}$/.test(value), {
      message: 'UF de naturalidade deve conter 2 letras',
    }),
  filiacao_mae: z.string().min(1, 'Nome da mãe é obrigatório'),
  filiacao_pai: z.string().optional(),
  // Situação prisional
  regime: z.string().min(1, 'Regime é obrigatório'),
  unidade_prisional: z.string().min(1, 'Unidade prisional é obrigatória'),
  prontuario: z.string().optional(),
  sei: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === '') return true;
      const onlyDigits = value.replace(/\D/g, '');
      return onlyDigits.length === 17;
    }, 'Número SEI deve conter 17 dígitos'),
  // Endereço e contato (campos antigos - compatibilidade)
  endereco: z.string().optional(),
  regiao_administrativa: z.string().optional(),
  telefone: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === '') return true;
      const onlyDigits = value.replace(/\D/g, '');
      return onlyDigits.length === 10 || onlyDigits.length === 11;
    }, 'Telefone deve conter 10 ou 11 dígitos'),

  // Novos campos de endereço estruturados
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z
    .string()
    .optional()
    .refine((value) => !value || /^[A-Z]{2}$/.test(value), {
      message: 'Estado deve conter 2 letras (UF)',
    }),
  // Região Administrativa (específico para DF)
  ra_df: z.string().optional(),
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
  disponibilidade_trabalho: z
    .enum(['MANHÃ', 'TARDE', 'MANHÃ e TARDE', 'SOMENTE NOITE'])
    .optional()
    .or(z.literal('')),
  ja_trabalhou_funap: z.boolean().default(false),
  ano_trabalho_anterior: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{4}$/.test(value), {
      message: 'Ano do trabalho anterior deve estar no formato AAAA',
    }),
  profissao_01: z.string().min(1, 'Profissão 01 é obrigatória'),
  profissao_02: z.string().optional(),
  // Artigos penais (códigos)
  artigos_penais: z
    .array(z.union([z.string(), z.number()]))
    .min(1, 'Selecione ao menos um artigo penal'),
  // Declarações e responsáveis
  responsavel_preenchimento: z.string().optional(),
  assinatura: z.string().optional(),
  data_assinatura: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Data da assinatura deve estar no formato YYYY-MM-DD',
    }),
  // Status de validação (Fase 1)
  status_validacao: z.string().optional(),
  substatus_operacional: z.string().nullable().optional(),
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

type AnyZodObject = z.ZodObject<z.ZodRawShape>;

export const withFichaConditionalRules = <T extends AnyZodObject>(schema: T) =>
  schema.superRefine((data, ctx) => {
    const temProblemaSaude = Boolean(data.tem_problema_saude);
    const problemaSaude =
      typeof data.problema_saude === 'string' ? data.problema_saude : '';

    if (temProblemaSaude && !problemaSaude.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['problema_saude'],
        message:
          'Informe o problema de saúde quando "Tem problema de saúde?" estiver marcado',
      });
    }

    const jaTrabalhouFunap = Boolean(data.ja_trabalhou_funap);
    const anoTrabalhoAnterior =
      typeof data.ano_trabalho_anterior === 'string'
        ? data.ano_trabalho_anterior
        : '';

    if (jaTrabalhouFunap && !anoTrabalhoAnterior.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ano_trabalho_anterior'],
        message:
          'Informe o ano do trabalho anterior quando "Já trabalhou pela FUNAP?" estiver marcado',
      });
    }
  });

export const createDetentoFichaCadastralSchema = withFichaConditionalRules(
  createDetentoFichaCadastralBaseSchema
);

export type CreateDetentoSchema = z.infer<typeof createDetentoSchema>;
export type CreateDetentoFichaCadastralSchema = z.infer<typeof createDetentoFichaCadastralSchema>;

export type UpdateDetentoSchema = CreateDetentoSchema & {
  detentoId: string;
};

export type UpdateDetentoFichaCadastralSchema = CreateDetentoFichaCadastralSchema & {
  fichaCadastralId: string;
};
