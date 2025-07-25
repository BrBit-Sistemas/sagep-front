import { z } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

import { Regime, Escolaridade } from '../types';

export const createDetentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  prontuario: z.string().min(1, 'Prontuário é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  regime: z.nativeEnum(Regime).default(Regime.FECHADO),
  escolaridade: z.nativeEnum(Escolaridade).default(Escolaridade.FUNDAMENTAL),
  unidade_id: z.string().min(1, 'Unidade é obrigatória'),
});

export const createDetentoFichaCadastralSchema = z.object({
  detento_id: z.string().optional(),
  // Identificação pessoal
  nome: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  rg: z.string().min(1, 'RG é obrigatório'),
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
  prontuario: z.string().min(1, 'Prontuário é obrigatório'),
  sei: z.string().optional(),
  planilha: z.string().optional(),
  cidade_processo: z.string().optional(),
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
  declaracao_veracidade: z.boolean().default(false),
  responsavel_preenchimento: z.string().optional(),
  assinatura: z.string().optional(),
  data_assinatura: z.string().optional(),
  site_codigo: z.string().optional(),
  // Metadados do formulário
  rodape_num_1: z.string().optional(),
  rodape_num_2: z.string().optional(),
  rodape_sei: z.string().optional(),
  // PDF gerado
  pdf_path: schemaHelper.file({ message: 'PDF é obrigatório' }),
});

export type CreateDetentoSchema = z.infer<typeof createDetentoSchema>;
export type CreateDetentoFichaCadastralSchema = z.infer<typeof createDetentoFichaCadastralSchema>;

export type UpdateDetentoSchema = CreateDetentoSchema & {
  detentoId: string;
};

export type UpdateDetentoFichaCadastralSchema = CreateDetentoFichaCadastralSchema & {
  fichaCadastralId: string;
};
