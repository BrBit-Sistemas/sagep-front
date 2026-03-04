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

export const parseRgOrgaoUf = (
  rgOrgaoUfRaw: string | null | undefined
): { rgOrgao: string; rgUf: string } => {
  const rgOrgaoUf = (rgOrgaoUfRaw || '').trim();
  let rgOrgao = '';
  let rgUf = '';

  if (rgOrgaoUf.includes('/')) {
    const [orgaoRaw, ufRaw] = rgOrgaoUf.split('/');
    rgOrgao = (orgaoRaw ?? '').trim();
    rgUf = (ufRaw ?? '').trim().toUpperCase();
  } else if (rgOrgaoUf) {
    const maybeUf = rgOrgaoUf.trim().toUpperCase();
    if (maybeUf.length === 2 && /^[A-Z]{2}$/.test(maybeUf)) {
      rgUf = maybeUf;
    } else {
      rgOrgao = rgOrgaoUf.trim();
    }
  }

  return { rgOrgao, rgUf };
};

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
  // Campos antigos (compatibilidade)
  endereco: fichaCadastral.endereco ?? '',
  regiao_administrativa: fichaCadastral.regiao_administrativa ?? '',
  telefone: fichaCadastral.telefone ?? '',

  // Novos campos de endereço
  cep: fichaCadastral.cep ?? '',
  logradouro: fichaCadastral.logradouro ?? '',
  numero: fichaCadastral.numero ?? '',
  complemento: fichaCadastral.complemento ?? '',
  bairro: fichaCadastral.bairro ?? '',
  cidade: fichaCadastral.cidade ?? '',
  estado: fichaCadastral.estado ?? '',
  ra_df: fichaCadastral.ra_df ?? '',
  escolaridade: fichaCadastral.escolaridade ?? '',
  tem_problema_saude: fichaCadastral.tem_problema_saude ?? false,
  problema_saude: fichaCadastral.problema_saude ?? '',
  regiao_bloqueada: fichaCadastral.regiao_bloqueada ?? '',
  experiencia_profissional: fichaCadastral.experiencia_profissional ?? '',
  fez_curso_sistema_prisional: fichaCadastral.fez_curso_sistema_prisional ?? '',
  disponibilidade_trabalho: fichaCadastral.disponibilidade_trabalho ?? '',
  ja_trabalhou_funap: fichaCadastral.ja_trabalhou_funap ?? false,
  ano_trabalho_anterior: fichaCadastral.ano_trabalho_anterior ?? '',
  profissao_01: fichaCadastral.profissao_01 ?? '',
  profissao_02: fichaCadastral.profissao_02 ?? '',
  artigos_penais: fichaCadastral.artigos_penais ?? [],
  responsavel_preenchimento: fichaCadastral.responsavel_preenchimento ?? '',
  assinatura: fichaCadastral.assinatura ?? '',
  data_assinatura: fichaCadastral.data_assinatura ?? '',
  pdf_path: fichaCadastral.pdf_path ?? '',
  status_validacao: fichaCadastral.status_validacao ?? 'AGUARDANDO_VALIDACAO',
  substatus_operacional: fichaCadastral.substatus_operacional ?? null,
  documentos:
    fichaCadastral.documentos?.map((doc) => ({
      id: doc.id,
      nome: doc.nome,
      s3_key: doc.s3_key,
      mime_type: doc.mime_type,
      file_size: doc.file_size,
      url: doc.url,
    })) ?? [],
});

export const fichaInativaToCreateFormValues = (
  fichaInativa: DetentoFichaCadastral,
  detento: Detento
): CreateDetentoFichaCadastralSchema => {
  const source = fichaInativa as any;

  const pickFirst = (...keys: string[]) => {
    for (const key of keys) {
      if (source?.[key] !== undefined && source?.[key] !== null) {
        return source[key];
      }
    }
    return undefined;
  };

  const toBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return ['true', '1', 'sim', 'yes'].includes(normalized);
    }
    return false;
  };

  const normalizeDisponibilidade = (value: any): string => {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    if (raw === 'MANHA') return 'MANHÃ';
    if (raw === 'MANHA e TARDE' || raw === 'MANHA E TARDE') return 'MANHÃ e TARDE';
    return raw;
  };

  const unidadePrisionalAtual = (detento as Detento & { unidade_prisional?: string })
    .unidade_prisional;

  return {
    detento_id: detento.id ?? fichaInativa.detento_id ?? '',
    nome: detento.nome ?? fichaInativa.nome ?? '',
    cpf: detento.cpf ?? fichaInativa.cpf ?? '',
    rg: fichaInativa.rg ?? '',
    rg_expedicao: fichaInativa.rg_expedicao ?? '',
    rg_orgao_uf: fichaInativa.rg_orgao_uf ?? '',
    data_nascimento: detento.data_nascimento ?? fichaInativa.data_nascimento ?? '',
    naturalidade: fichaInativa.naturalidade ?? '',
    naturalidade_uf: fichaInativa.naturalidade_uf ?? '',
    filiacao_mae: detento.mae ?? fichaInativa.filiacao_mae ?? '',
    filiacao_pai: fichaInativa.filiacao_pai ?? '',
    regime: detento.regime ?? fichaInativa.regime ?? '',
    unidade_prisional: unidadePrisionalAtual ?? fichaInativa.unidade_prisional ?? '',
    prontuario: detento.prontuario ?? fichaInativa.prontuario ?? '',
    sei: fichaInativa.sei ?? '',
    endereco: fichaInativa.endereco ?? '',
    regiao_administrativa: fichaInativa.regiao_administrativa ?? '',
    telefone: fichaInativa.telefone ?? '',
    cep: fichaInativa.cep ?? '',
    logradouro: fichaInativa.logradouro ?? '',
    numero: fichaInativa.numero ?? '',
    complemento: fichaInativa.complemento ?? '',
    bairro: fichaInativa.bairro ?? '',
    cidade: fichaInativa.cidade ?? '',
    estado: fichaInativa.estado ?? '',
    ra_df: fichaInativa.ra_df ?? '',
    escolaridade: detento.escolaridade ?? fichaInativa.escolaridade ?? '',
    tem_problema_saude: toBoolean(pickFirst('tem_problema_saude', 'temProblemaSaude')),
    problema_saude:
      pickFirst('problema_saude', 'problemaSaude', 'problemas_saude', 'problemasSaude') ?? '',
    regiao_bloqueada: fichaInativa.regiao_bloqueada ?? '',
    experiencia_profissional: fichaInativa.experiencia_profissional ?? '',
    fez_curso_sistema_prisional:
      pickFirst(
        'fez_curso_sistema_prisional',
        'fezCursoSistemaPrisional',
        'curso_sistema_prisional',
        'cursoSistemaPrisional'
      ) ?? '',
    disponibilidade_trabalho: normalizeDisponibilidade(
      pickFirst('disponibilidade_trabalho', 'disponibilidadeTrabalho')
    ),
    ja_trabalhou_funap: fichaInativa.ja_trabalhou_funap ?? false,
    ano_trabalho_anterior:
      pickFirst(
        'ano_trabalho_anterior',
        'anoTrabalhoAnterior',
        'ano_trabalho_anterior_funap',
        'anoTrabalhoAnteriorFunap'
      ) ?? '',
    profissao_01: fichaInativa.profissao_01 ?? '',
    profissao_02: fichaInativa.profissao_02 ?? '',
    artigos_penais: fichaInativa.artigos_penais ?? [],
    responsavel_preenchimento: '',
    assinatura: '',
    data_assinatura: '',
    pdf_path: '',
    status_validacao: 'AGUARDANDO_VALIDACAO',
    substatus_operacional: null,
    documentos: [],
  };
};
