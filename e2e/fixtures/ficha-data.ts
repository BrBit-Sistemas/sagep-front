import { createHash } from 'node:crypto';

export type FichaMode = 'minimal' | 'complete';

type BuildFichaPayloadOptions = {
  mode: FichaMode;
  seed: string | number;
  unidadeId: string;
  unidadeNome: string;
};

type EnderecoDraft = {
  estado: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  ra_df: string;
};

export type FichaDraft = {
  seed: string;
  cpf: string;
  detento: {
    nome: string;
    mae: string;
    prontuario: string;
    cpf: string;
    data_nascimento: string;
    regime: string;
    escolaridade: string;
    unidade_id: string;
  };
  form: {
    nome: string;
    cpf: string;
    rg: string;
    rg_orgao: string;
    rg_uf: string;
    data_nascimento: string;
    data_nascimento_display: string;
    naturalidade: string;
    naturalidade_uf: string;
    filiacao_mae: string;
    filiacao_pai: string;
    regime: string;
    unidade_id: string;
    unidade_prisional: string;
    prontuario: string;
    sei: string;
    telefone: string;
    escolaridade: string;
    tem_problema_saude: boolean;
    problema_saude: string;
    regiao_bloqueada: string;
    experiencia_profissional: string;
    fez_curso_sistema_prisional: string;
    disponibilidade_trabalho: string;
    ja_trabalhou_funap: boolean;
    ano_trabalho_anterior: string;
    profissao_01_search: string;
    profissao_01: string;
    profissao_02_search: string;
    profissao_02: string;
    responsavel_preenchimento: string;
    assinatura: string;
    endereco: EnderecoDraft;
    artigos_penais: string[];
  };
};

const REGIME_PADRAO = 'SEMIABERTO';
const ESCOLARIDADE_PADRAO = 'ENSINO MÉDIO COMPLETO';
const DISPONIBILIDADE_PADRAO = 'MANHÃ';

function buildNumericSequence(seed: string): string {
  const hash = createHash('sha256').update(seed).digest('hex');
  const numeric = Array.from(hash, (char) => (parseInt(char, 16) % 10).toString()).join('');
  return numeric;
}

function cpfCheckDigit(digits: string): string {
  const factorStart = digits.length + 1;
  const total = digits
    .split('')
    .map(Number)
    .reduce((sum, digit, index) => sum + digit * (factorStart - index), 0);
  const remainder = total % 11;
  return remainder < 2 ? '0' : String(11 - remainder);
}

function formatDateToDisplay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function generateValidCpf(seed: string | number): string {
  const normalizedSeed = String(seed).trim();
  const numeric = buildNumericSequence(normalizedSeed);
  let base = numeric.slice(0, 9);

  if (/^(\d)\1+$/.test(base)) {
    base = `123${numeric.slice(3, 9)}`;
  }

  const firstDigit = cpfCheckDigit(base);
  const secondDigit = cpfCheckDigit(`${base}${firstDigit}`);

  return `${base}${firstDigit}${secondDigit}`;
}

export function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function buildFichaPayload({
  mode,
  seed,
  unidadeId,
  unidadeNome,
}: BuildFichaPayloadOptions): FichaDraft {
  const normalizedSeed = String(seed);
  const numeric = buildNumericSequence(normalizedSeed);
  const suffix = numeric.slice(0, 8);
  const cpf = generateValidCpf(normalizedSeed);
  const dataNascimento = '1990-01-01';
  const nome = `PW E2E Detento ${suffix}`;
  const mae = `PW E2E Mae ${suffix}`;
  const prontuario = `PW-${suffix}`;

  const endereco: EnderecoDraft = {
    estado: 'DF',
    cidade: 'Brasília',
    logradouro: `Rua PW E2E ${suffix}`,
    numero: '123',
    complemento: mode === 'complete' ? 'Bloco A' : '',
    bairro: 'Centro',
    ra_df: 'RA I - Brasília',
  };

  return {
    seed: normalizedSeed,
    cpf,
    detento: {
      nome,
      mae,
      prontuario,
      cpf,
      data_nascimento: dataNascimento,
      regime: REGIME_PADRAO,
      escolaridade: ESCOLARIDADE_PADRAO,
      unidade_id: unidadeId,
    },
    form: {
      nome,
      cpf,
      rg: `RG${suffix}`,
      rg_orgao: 'SSP',
      rg_uf: 'DF',
      data_nascimento: dataNascimento,
      data_nascimento_display: formatDateToDisplay(dataNascimento),
      naturalidade: 'Brasília',
      naturalidade_uf: 'DF',
      filiacao_mae: mae,
      filiacao_pai: 'Nao informado',
      regime: REGIME_PADRAO,
      unidade_id: unidadeId,
      unidade_prisional: unidadeNome,
      prontuario,
      sei: `12345${suffix.slice(0, 3)}.${suffix.slice(3)}2024`,
      telefone: '61999999999',
      escolaridade: ESCOLARIDADE_PADRAO,
      tem_problema_saude: mode === 'complete',
      problema_saude: mode === 'complete' ? 'Hipertensao controlada' : '',
      regiao_bloqueada: mode === 'complete' ? 'RA IX - Ceilândia' : '',
      experiencia_profissional:
        mode === 'complete' ? 'Atendimento ao publico e servicos gerais' : 'Servicos gerais',
      fez_curso_sistema_prisional: mode === 'complete' ? 'Curso de logistica' : '',
      disponibilidade_trabalho: DISPONIBILIDADE_PADRAO,
      ja_trabalhou_funap: mode === 'complete',
      ano_trabalho_anterior: mode === 'complete' ? '2024' : '',
      profissao_01_search: 'Advogado',
      profissao_01: 'Advogado',
      profissao_02_search: mode === 'complete' ? 'Enfermeiro' : '',
      profissao_02: mode === 'complete' ? 'Enfermeiro' : '',
      responsavel_preenchimento: `pw-e2e-responsavel-${suffix}`,
      assinatura: `pw-e2e-assinatura-${suffix}`,
      endereco,
      artigos_penais:
        mode === 'complete' ? ['PW-E2E-ARTIGO-1', 'PW-E2E-ARTIGO-2'] : ['PW-E2E-ARTIGO-1'],
    },
  };
}
