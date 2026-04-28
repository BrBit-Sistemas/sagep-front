import type { ModalidadeExecucao } from '../types';
import type { CodigoTemplateContrato } from 'src/api/empresa-convenios/convenio-contrato-catalog';

import { z } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const modalidadesExecucao: ModalidadeExecucao[] = ['INTRAMUROS', 'EXTRAMUROS'];

function isHorarioHmValid(s: string): boolean {
  const t = s.trim();
  if (!/^\d{2}:\d{2}$/.test(t)) {
    return false;
  }
  const [hs, ms] = t.split(':');
  const h = Number(hs);
  const m = Number(ms);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

const toOptionalInt = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(z.number().int().min(1).optional());

const optionalNonNegNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(z.number().min(0).optional());

const optionalIntNonNeg = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(z.number().int().min(0).optional());

const optionalPercent = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  })
  .pipe(
    z
      .number()
      .min(0, 'Informe um percentual maior ou igual a 0')
      .max(100, 'Informe um percentual menor ou igual a 100')
      .optional(),
  );

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
  email: schemaHelper.email(),
  telefone: z.string().optional(),
});

const nivelDistribuicaoSchema = z
  .union([z.literal(''), z.literal('I'), z.literal('II'), z.literal('III')])
  .optional()
  .nullable()
  .transform((v) => (v === '' || v == null ? null : v));

const distribuicaoProfissaoRowSchema = z.object({
  profissao_id: z.string().uuid().optional().or(z.literal('')),
  quantidade: z.coerce.number().int().min(0).default(0),
  nivel: nivelDistribuicaoSchema,
  observacao: z.string().optional(),
});

export const GRAUS_DESEMPENHO = [
  { grau: 'G', nome: 'Satisfatório', percentual: 10 },
  { grau: 'F', nome: 'Convincente', percentual: 15 },
  { grau: 'E', nome: 'Bom', percentual: 20 },
  { grau: 'D', nome: 'Ótimo', percentual: 25 },
  { grau: 'C', nome: 'Excelente', percentual: 30 },
  { grau: 'B', nome: 'Extraordinário', percentual: 35 },
  { grau: 'A', nome: 'Esplêndido', percentual: 40 },
] as const;

const grauLinhaSchema = z.object({
  grau: z.string(),
  nome: z.string(),
  percentual: z.coerce.number().min(0, 'Mínimo 0%').max(100, 'Máximo 100%'),
  nivel_i: z.coerce.number().nullable().optional(),
  nivel_ii: z.coerce.number().nullable().optional(),
  nivel_iii: z.coerce.number().nullable().optional(),
});

export const empresaConvenioBaseSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  modalidade_execucao: z.enum(modalidadesExecucao as [ModalidadeExecucao, ...ModalidadeExecucao[]], {
    message: 'Modalidade é obrigatória',
  }),
  regimes_permitidos: z
    .array(z.union([z.number(), z.string()]))
    .transform((arr) => arr.map((x) => Number(x)).filter((n) => !Number.isNaN(n)))
    .pipe(z.array(z.number()).min(1, 'Selecione ao menos um regime')),
  artigos_vedados: z.array(z.string()).default([]),
  max_reeducandos: toOptionalInt,
  permite_variacao_quantidade: z.boolean().default(true),
  tipo_calculo_remuneracao: z.enum(['MENSAL', 'HORA', 'HIBRIDO']),
  usa_nivel: z.boolean().default(true),
  valor_nivel_i: optionalNonNegNumber,
  valor_nivel_ii: optionalNonNegNumber,
  valor_nivel_iii: optionalNonNegNumber,
  transporte_responsavel: z.enum(['FUNAP', 'EMPRESA', 'NENHUM']),
  alimentacao_responsavel: z.enum(['FUNAP', 'EMPRESA', 'NENHUM']),
  valor_transporte: z.coerce.number().min(0),
  valor_alimentacao: z.coerce.number().min(0),
  beneficio_variavel_por_dia: z.boolean().default(true),
  observacao_beneficio: z.string().optional(),
  quantidade_nivel_i: optionalIntNonNeg,
  quantidade_nivel_ii: optionalIntNonNeg,
  quantidade_nivel_iii: optionalIntNonNeg,
  permite_bonus_produtividade: z.boolean().default(false),
  bonus_produtividade_descricao: z.string().optional(),
  bonus_produtividade_linhas: z.array(grauLinhaSchema).optional(),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().optional().nullable(),
  data_repactuacao: z.string().optional().nullable(),
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
  distribuicao_profissoes: z.array(distribuicaoProfissaoRowSchema).default([]),
});

export type ReadTemplateContratoLike = {
  template_contrato_id: string;
  codigo: CodigoTemplateContrato;
};


export const buildEmpresaConvenioSchema = (templates: ReadTemplateContratoLike[]) =>
  empresaConvenioBaseSchema
    .transform((data) => {
      const { bonus_produtividade_linhas, ...rest } = data;
      const bonusJson = bonus_produtividade_linhas
        ?.map(({ grau, nome, percentual }) => ({ grau, nome, percentual }));
      return {
        ...rest,
        bonus_produtividade_tabela_json: bonusJson?.length ? bonusJson : undefined,
      };
    })
    .superRefine((data, ctx) => {
      const tpl = templates.find((t) => t.template_contrato_id === data.template_contrato_id);
      const codigo = tpl?.codigo;
      const qI = data.quantidade_nivel_i ?? 0;
      const qII = data.quantidade_nivel_ii ?? 0;
      const qIII = data.quantidade_nivel_iii ?? 0;
      const sumNivel = qI + qII + qIII;
      if (
        codigo === 'PADRAO_ORGAO_PUBLICO_GDF' &&
        data.max_reeducandos != null &&
        data.max_reeducandos > 0 &&
        sumNivel > data.max_reeducandos
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A soma por nível não pode ultrapassar a quantidade máxima de reeducandos',
          path: ['quantidade_nivel_i'],
        });
      }
      const permiteBonus = data.permite_bonus_produtividade === true;
      if (permiteBonus) {
        const hasLinhas =
          Array.isArray(data.bonus_produtividade_tabela_json) &&
          data.bonus_produtividade_tabela_json.length > 0;
        const hasDesc = Boolean(data.bonus_produtividade_descricao?.trim());
        if (!hasLinhas && !hasDesc) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Preencha pelo menos um valor na tabela de desempenho ou informe a descrição do bônus',
            path: ['bonus_produtividade_descricao'],
          });
        }
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
        if (hi && !isHorarioHmValid(hi)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Horário de início inválido (use 00:00 a 23:59)',
            path: ['horario_inicio'],
          });
        }
        if (hf && !isHorarioHmValid(hf)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Horário de fim inválido (use 00:00 a 23:59)',
            path: ['horario_fim'],
          });
        }
      }
      if (codigo === 'PADRAO_ORGAO_PUBLICO_GDF') {
        if ((data.quantidade_nivel_i ?? 0) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Template GDF exige quantidade maior que zero no nível I',
            path: ['quantidade_nivel_i'],
          });
        }
        if ((data.quantidade_nivel_ii ?? 0) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Template GDF exige quantidade maior que zero no nível II',
            path: ['quantidade_nivel_ii'],
          });
        }
        if ((data.quantidade_nivel_iii ?? 0) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Template GDF exige quantidade maior que zero no nível III',
            path: ['quantidade_nivel_iii'],
          });
        }
      }
      const rows = (data.distribuicao_profissoes ?? []).filter((r) =>
        String(r.profissao_id || '').trim()
      );
      const sumDist = rows.reduce((s, r) => s + (Number(r.quantidade) || 0), 0);
      if (data.max_reeducandos != null && data.max_reeducandos > 0 && sumDist > data.max_reeducandos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A soma das vagas por profissão não pode ultrapassar o máximo de reeducandos',
          path: ['distribuicao_profissoes'],
        });
      }
      const keySet = new Set<string>();
      for (const r of rows) {
        const nk = r.nivel ?? 'null';
        const k = `${r.profissao_id}|${nk}`;
        if (keySet.has(k)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Não repita a mesma profissão com o mesmo nível',
            path: ['distribuicao_profissoes'],
          });
          break;
        }
        keySet.add(k);
      }
      for (const r of rows) {
        if (!r.nivel && data.usa_nivel) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Informe o nível em cada linha quando o convênio usa nível',
            path: ['distribuicao_profissoes'],
          });
          break;
        }
      }
      if (data.usa_nivel && codigo === 'PADRAO_ORGAO_PUBLICO_GDF') {
        const sI = rows
          .filter((x) => x.nivel === 'I')
          .reduce((s, x) => s + x.quantidade, 0);
        const sII = rows
          .filter((x) => x.nivel === 'II')
          .reduce((s, x) => s + x.quantidade, 0);
        const sIII = rows
          .filter((x) => x.nivel === 'III')
          .reduce((s, x) => s + x.quantidade, 0);
        if (
          data.quantidade_nivel_i != null &&
          data.quantidade_nivel_i >= 0 &&
          sI > data.quantidade_nivel_i
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Soma das profissões do nível I excede o quantitativo do nível I',
            path: ['distribuicao_profissoes'],
          });
        }
        if (
          data.quantidade_nivel_ii != null &&
          data.quantidade_nivel_ii >= 0 &&
          sII > data.quantidade_nivel_ii
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Soma das profissões do nível II excede o quantitativo do nível II',
            path: ['distribuicao_profissoes'],
          });
        }
        if (
          data.quantidade_nivel_iii != null &&
          data.quantidade_nivel_iii >= 0 &&
          sIII > data.quantidade_nivel_iii
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Soma das profissões do nível III excede o quantitativo do nível III',
            path: ['distribuicao_profissoes'],
          });
        }
      }
      for (const r of rows) {
        if (r.quantidade < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Quantidade por profissão deve ser maior que zero',
            path: ['distribuicao_profissoes'],
          });
          break;
        }
      }
      (data.responsaveis ?? []).forEach((r, idx) => {
        if (!r.nome?.trim()) return;
      });
    });

export type CreateEmpresaConvenioFormValues = z.input<typeof empresaConvenioBaseSchema>;
export type CreateEmpresaConvenioSchema = z.output<
  ReturnType<typeof buildEmpresaConvenioSchema>
>;
export type UpdateEmpresaConvenioSchema = CreateEmpresaConvenioSchema;
export type EmpresaConvenioLocalSchema = z.infer<typeof localExecucaoSchema>;
