import type { Detento, DetentoFichaCadastral } from '../types';
import type { CreateDetentoSchema, CreateDetentoFichaCadastralSchema } from '../schemas';

export const detentoToFormValues = (detento: Detento): CreateDetentoSchema => ({
  nome: detento?.nome ?? '',
  mae: detento?.mae ?? '',
  prontuario: detento?.prontuario ?? '',
  cpf: detento?.cpf ?? '',
  data_nascimento: detento?.data_nascimento ?? '',
  regime: detento?.regime ?? '',
  escolaridade: detento?.escolaridade ?? '',
  unidade_id: detento?.unidade_id ?? '',
});

export const fichaCadastralToFormValues = (
  fichaCadastral: DetentoFichaCadastral
): CreateDetentoFichaCadastralSchema => ({
  detento_id: fichaCadastral.detento_id ?? '',
  nome: fichaCadastral.nome ?? '',
  cpf: fichaCadastral.cpf ?? '',
  rg: fichaCadastral.rg ?? '',
  rg_expedicao: fichaCadastral.rg_expedicao ?? '',
  rg_orgao_uf: fichaCadastral.rg_orgao_uf ?? '',
  data_nascimento: fichaCadastral.data_nascimento ?? '',
  naturalidade: fichaCadastral.naturalidade ?? '',
  naturalidade_uf: fichaCadastral.naturalidade_uf ?? '',
  filiacao_mae: fichaCadastral.filiacao_mae ?? '',
  filiacao_pai: fichaCadastral.filiacao_pai ?? '',
  regime: fichaCadastral.regime ?? '',
  unidade_prisional: fichaCadastral.unidade_prisional ?? '',
  prontuario: fichaCadastral.prontuario ?? '',
  sei: fichaCadastral.sei ?? '',
  endereco: fichaCadastral.endereco ?? '',
  regiao_administrativa: fichaCadastral.regiao_administrativa ?? '',
  telefone: fichaCadastral.telefone ?? '',
  escolaridade: fichaCadastral.escolaridade ?? '',
  tem_problema_saude: fichaCadastral.tem_problema_saude ?? false,
  problema_saude: fichaCadastral.problema_saude ?? '',
  regiao_bloqueada: fichaCadastral.regiao_bloqueada ?? '',
  experiencia_profissional: fichaCadastral.experiencia_profissional ?? '',
  fez_curso_sistema_prisional: fichaCadastral.fez_curso_sistema_prisional ?? '',
  ja_trabalhou_funap: fichaCadastral.ja_trabalhou_funap ?? false,
  ano_trabalho_anterior: fichaCadastral.ano_trabalho_anterior ?? '',
  profissao_01: fichaCadastral.profissao_01 ?? '',
  profissao_02: fichaCadastral.profissao_02 ?? '',
  responsavel_preenchimento: fichaCadastral.responsavel_preenchimento ?? '',
  assinatura: fichaCadastral.assinatura ?? '',
  data_assinatura: fichaCadastral.data_assinatura ?? '',
  pdf_path: fichaCadastral.pdf_path ?? '',
});
