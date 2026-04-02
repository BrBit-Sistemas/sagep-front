import type { RHFTextFieldProps } from './rhf-text-field';

import { RHFTextField } from './rhf-text-field';

// ----------------------------------------------------------------------

export type RHFCpfFieldProps = Omit<RHFTextFieldProps, 'mask' | 'replacement' | 'maskPreset' | 'type'>;

export function RHFCpfField(props: RHFCpfFieldProps) {
  return <RHFTextField {...props} maskPreset="cpf" />;
}
