export function isValidCpf(input: string): boolean {
  if (!input) return false;

  const digitsOnly = input.replace(/\D/g, '');
  if (digitsOnly.length !== 11) return false;

  // Reject CPFs with all identical digits (e.g., 00000000000, 11111111111)
  if (/^(\d)\1{10}$/.test(digitsOnly)) return false;

  const calcCheckDigit = (base: string, factorStart: number): number => {
    let sum = 0;
    for (let i = 0; i < base.length; i += 1) {
      sum += Number(base[i]) * (factorStart - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const baseNine = digitsOnly.substring(0, 9);
  const firstCheck = calcCheckDigit(baseNine, 10);
  if (firstCheck !== Number(digitsOnly[9])) return false;

  const baseTen = digitsOnly.substring(0, 10);
  const secondCheck = calcCheckDigit(baseTen, 11);
  if (secondCheck !== Number(digitsOnly[10])) return false;

  return true;
}
