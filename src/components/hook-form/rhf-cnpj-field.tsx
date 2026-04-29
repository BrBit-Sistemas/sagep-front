import type { RHFTextFieldProps } from './rhf-text-field';

import { RHFTextField } from './rhf-text-field';

// ----------------------------------------------------------------------

export type RHFCnpjFieldProps = Omit<RHFTextFieldProps, 'mask' | 'replacement' | 'maskPreset' | 'type'>;

export function RHFCnpjField(props: RHFCnpjFieldProps) {
  return <RHFTextField {...props} maskPreset="cnpj" />;
}
