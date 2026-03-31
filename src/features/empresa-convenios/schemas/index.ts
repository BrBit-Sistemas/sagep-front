import type { ModalidadeExecucao } from '../types';
import type { CodigoTemplateContrato } from 'src/api/empresa-convenios/convenio-contrato-catalog';

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

const optionalIntMeta = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(z.number().int().min(1).max(168).optional());

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

const responsavelRowSchema = z.object({
  tipo: z.enum(['REPRESENTANTE_LEGAL', 'PREPOSTO_OPERACIONAL']),
  nome: z.string().optional(),
  cargo: z.string().optional(),
  documento: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || v === '' || z.string().email().safeParse(v).success, {
      message: 'E-mail inválido',
    }),
  telefone: z.string().optional(),
});

const quantidadeNivelRowSchema = z.object({
  nivel: z.enum(['I', 'II', 'III']),
  quantidade: z.coerce.number().int().min(0),
});

export const empresaConvenioBaseSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  modalidade_execucao: z.enum(modalidadesExecucao as [ModalidadeExecucao, ...ModalidadeExecucao[]], {
    message: 'Modalidade é obrigatória',
  }),
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
  template_contrato_id: z.string().uuid('Template de contrato é obrigatório'),
  jornada_tipo: z.string().optional(),
  carga_horaria_semanal: optionalIntMeta,
  escala: z.string().optional(),
  horario_inicio: z.string().nullable().optional(),
  horario_fim: z.string().nullable().optional(),
  possui_seguro_acidente: z.boolean().default(false),
  tipo_cobertura_seguro: z.string().optional(),
  observacao_seguro: z.string().optional(),
  observacao_juridica: z.string().optional(),
  clausula_adicional: z.string().optional(),
  descricao_complementar_objeto: z.string().optional(),
  observacao_operacional: z.string().optional(),
  tabela_produtividade_id: z.string().uuid().optional().or(z.literal('')),
  responsaveis: z.array(responsavelRowSchema).max(2).default([
    {
      tipo: 'REPRESENTANTE_LEGAL',
      nome: '',
      cargo: '',
      documento: '',
      email: '',
      telefone: '',
    },
    {
      tipo: 'PREPOSTO_OPERACIONAL',
      nome: '',
      cargo: '',
      documento: '',
      email: '',
      telefone: '',
    },
  ]),
  quantidades_nivel: z.array(quantidadeNivelRowSchema).default([
    { nivel: 'I', quantidade: 0 },
    { nivel: 'II', quantidade: 0 },
    { nivel: 'III', quantidade: 0 },
  ]),
});

export type ReadTemplateContratoLike = {
  template_contrato_id: string;
  codigo: CodigoTemplateContrato;
};

export const buildEmpresaConvenioSchema = (templates: ReadTemplateContratoLike[]) =>
  empresaConvenioBaseSchema.superRefine((data, ctx) => {
    const tpl = templates.find((t) => t.template_contrato_id === data.template_contrato_id);
    const codigo = tpl?.codigo;
    const qRows = data.quantidades_nivel ?? [];
    const sumNivel = qRows.reduce((s, q) => s + (Number(q.quantidade) || 0), 0);
    if (
      data.max_reeducandos != null &&
      data.max_reeducandos > 0 &&
      sumNivel > data.max_reeducandos
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A soma por nível não pode ultrapassar a quantidade máxima de reeducandos',
        path: ['quantidades_nivel'],
      });
    }
    if (data.permite_bonus_produtividade && !String(data.tabela_produtividade_id || '').trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione a tabela de produtividade',
        path: ['tabela_produtividade_id'],
      });
    }
    if (codigo === 'PADRAO_INTRAMUROS') {
      const hi = data.horario_inicio != null ? String(data.horario_inicio).trim() : '';
      const hf = data.horario_fim != null ? String(data.horario_fim).trim() : '';
      if (
        !data.jornada_tipo?.trim() ||
        data.carga_horaria_semanal == null ||
        !data.escala?.trim() ||
        !hi ||
        !hf
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Template intramuros exige jornada, carga horária, escala e horários (início e fim)',
          path: ['jornada_tipo'],
        });
      }
    }
    if (codigo === 'PADRAO_ORGAO_PUBLICO_GDF') {
      for (const n of ['I', 'II', 'III'] as const) {
        const row = qRows.find((x) => x.nivel === n);
        if (row == null || row.quantidade <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Template GDF exige quantidade maior que zero no nível ${n}`,
            path: ['quantidades_nivel'],
          });
        }
      }
    }
    (data.responsaveis ?? []).forEach((r, idx) => {
      if (!r.nome?.trim()) return;
      if (r.email && r.email !== '' && !z.string().email().safeParse(r.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'E-mail inválido',
          path: ['responsaveis', idx, 'email'],
        });
      }
    });
  });

export type CreateEmpresaConvenioFormValues = z.input<typeof empresaConvenioBaseSchema>;
export type CreateEmpresaConvenioSchema = z.output<
  ReturnType<typeof buildEmpresaConvenioSchema>
>;
export type UpdateEmpresaConvenioSchema = CreateEmpresaConvenioSchema;
export type EmpresaConvenioLocalSchema = z.infer<typeof localExecucaoSchema>;
