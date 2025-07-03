// Formata um CPF: 12345678901 => 123.456.789-01
export function formatCpf(cpf: string): string {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata um CNPJ: 12345678000199 => 12.345.678/0001-99
export function formatCnpj(cnpj: string): string {
  if (!cnpj) return '';
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Formata telefone: 11987654321 => (11) 98765-4321
export function formatPhone(phone: string): string {
  if (!phone) return '';
  if (phone.length === 10) {
    // Fixo: 1123456789 => (11) 2345-6789
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  // Celular: 11987654321 => (11) 98765-4321
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}
