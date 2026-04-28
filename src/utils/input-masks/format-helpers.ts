import { format } from '@react-input/mask';

import { INPUT_MASK_PRESETS } from './react-input-mask-presets';

export function formatCepFromStorage(raw: string | null | undefined): string {
  if (raw == null || raw === '') {
    return '';
  }
  const digits = String(raw).replace(/\D/g, '').slice(0, 8);
  if (digits.length === 0) {
    return '';
  }
  const { mask, replacement } = INPUT_MASK_PRESETS.cep;
  return format(digits, { mask, replacement });
}

export function formatPhoneBrMobileFromStorage(raw: string | null | undefined): string {
  if (raw == null || raw === '') {
    return '';
  }
  const digits = String(raw).replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) {
    return '';
  }
  const { mask, replacement } = INPUT_MASK_PRESETS.phoneBrMobile;
  return format(digits, { mask, replacement });
}

export function formatCnpjFromStorage(raw: string | null | undefined): string {
  if (raw == null || raw === '') {
    return '';
  }
  const digits = String(raw).replace(/\D/g, '').slice(0, 14);
  if (digits.length === 0) {
    return '';
  }
  const { mask, replacement } = INPUT_MASK_PRESETS.cnpj;
  return format(digits, { mask, replacement });
}

export function formatDocumentoBrFromStorage(raw: string | null | undefined): string {
  if (raw == null || raw === '') {
    return '';
  }
  const digits = String(raw).replace(/\D/g, '').slice(0, 14);
  if (digits.length === 0) {
    return '';
  }
  if (digits.length <= 11) {
    const { mask, replacement } = INPUT_MASK_PRESETS.cpf;
    return format(digits, { mask, replacement });
  }
  const { mask, replacement } = INPUT_MASK_PRESETS.cnpj;
  return format(digits, { mask, replacement });
}

export function formatTimeHmFromStorage(raw: string | null | undefined): string | null {
  if (raw == null || raw === '') {
    return null;
  }
  const t = String(raw).trim();
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) {
    return t;
  }
  const h = m[1].padStart(2, '0');
  const min = m[2].slice(0, 2);
  const { mask, replacement } = INPUT_MASK_PRESETS.timeHm;
  return format(`${h}${min}`, { mask, replacement });
}
