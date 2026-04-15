import { createHash } from 'node:crypto';

export type EmpresaMode = 'minimal' | 'complete';

type BuildEmpresaPayloadOptions = {
  mode?: EmpresaMode;
  seed: string | number;
};

export type EmpresaPayload = {
  razao_social: string;
  cnpj: string;
  tipo: 'PRIVADA' | 'PUBLICA';
  inscricao_estadual?: string;
  logradouro: string;
  logradouro_numero: string;
  cep: string;
  cidade: string;
  estado: string;
};

function buildNumericSequence(seed: string): string {
  const hash = createHash('sha256').update(seed).digest('hex');
  return Array.from(hash, (char) => (parseInt(char, 16) % 10).toString()).join('');
}

function cnpjCheckDigit(digits: string, weights: number[]): string {
  const total = digits
    .split('')
    .map(Number)
    .reduce((sum, digit, index) => sum + digit * weights[index], 0);
  const remainder = total % 11;
  return remainder < 2 ? '0' : String(11 - remainder);
}

export function generateValidCnpj(seed: string | number): string {
  const normalizedSeed = String(seed).trim();
  const numeric = buildNumericSequence(normalizedSeed);

  let base8 = numeric.slice(0, 8);

  // Avoid all-same-digit sequences (invalid CNPJ)
  if (/^(\d)\1+$/.test(base8)) {
    base8 = `12${numeric.slice(2, 8)}`;
  }

  const base12 = `${base8}0001`;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = cnpjCheckDigit(base12, weights1);
  const d2 = cnpjCheckDigit(`${base12}${d1}`, weights2);

  return `${base12}${d1}${d2}`;
}

export function buildEmpresaPayload({
  mode = 'minimal',
  seed,
}: BuildEmpresaPayloadOptions): EmpresaPayload {
  const normalizedSeed = String(seed);
  const numeric = buildNumericSequence(normalizedSeed);
  const suffix = numeric.slice(0, 8);
  const cnpj = generateValidCnpj(normalizedSeed);

  // Alternate between PRIVADA and PUBLICA based on seed parity
  const tipo: 'PRIVADA' | 'PUBLICA' = parseInt(suffix[0], 10) % 2 === 0 ? 'PRIVADA' : 'PUBLICA';

  // CEP: 8 numeric digits, never all-zero
  const rawCep = numeric.slice(8, 16);
  const cep = rawCep === '00000000' ? `70040${numeric.slice(0, 3)}` : rawCep;

  return {
    razao_social: `PW E2E Empresa ${suffix}`,
    cnpj,
    tipo,
    ...(mode === 'complete' && { inscricao_estadual: `IE${suffix}` }),
    logradouro: `Rua PW E2E ${suffix}`,
    logradouro_numero: String(100 + (parseInt(suffix.slice(0, 3), 10) % 900)),
    cep,
    cidade: 'Brasília',
    estado: 'DF',
  };
}
