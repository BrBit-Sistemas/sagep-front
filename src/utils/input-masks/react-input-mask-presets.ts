/**
 * Presets para {@link https://github.com/GoncharukOrg/react-input | @react-input/mask} — biblioteca ativa
 * (releases recentes, ~200k downloads/semana no npm). Reutilize `maskPreset` em qualquer `Field.Text` / `RHFTextField`.
 */
import type { Modify, MaskOptions, Replacement } from '@react-input/mask';

const digit: Replacement = { _: /\d/ };

export const INPUT_MASK_PRESETS = {
  cep: { mask: '_____-___', replacement: digit } satisfies MaskOptions,
  uf: { mask: '__', replacement: { _: /[A-Za-z]/ } } satisfies MaskOptions,
  timeHm: { mask: '__:__', replacement: digit } satisfies MaskOptions,
  phoneBrMobile: { mask: '(__) _____-____', replacement: digit } satisfies MaskOptions,
  cpf: { mask: '___.___.___-__', replacement: digit } satisfies MaskOptions,
  cnpj: { mask: '__.___.___/____-__', replacement: digit } satisfies MaskOptions,
  documentoBr: {
    mask: '___.___.___-__',
    replacement: digit,
    modify: (({ value }) => {
      const len = value.replace(/\D/g, '').length;
      if (len <= 11) {
        return { mask: '___.___.___-__', replacement: digit };
      }
      return { mask: '__.___.___/____-__', replacement: digit };
    }) as Modify,
  } satisfies MaskOptions,
  positiveInt3: { mask: '___', replacement: digit } satisfies MaskOptions,
  positiveInt5: { mask: '_____', replacement: digit } satisfies MaskOptions,
  positiveInt7: { mask: '_______', replacement: digit } satisfies MaskOptions,
  escalaTurnos: { mask: '___x___', replacement: digit } satisfies MaskOptions,
} as const;

export type InputMaskPresetId = keyof typeof INPUT_MASK_PRESETS;

export function getInputMaskPreset(id: InputMaskPresetId): MaskOptions {
  return INPUT_MASK_PRESETS[id];
}
