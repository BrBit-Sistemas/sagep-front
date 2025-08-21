export function isValidRg(input: string): boolean {
  if (!input) return false;

  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');

  // RG must have between 8 and 12 digits (varies by state)
  if (digitsOnly.length < 8 || digitsOnly.length > 12) return false;

  // Reject RGs with all identical digits
  if (/^(\d)\1+$/.test(digitsOnly)) return false;

  return true;
}


