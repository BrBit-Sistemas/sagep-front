import type { RHFTextFieldProps } from './rhf-text-field';

import { RHFTextField } from './rhf-text-field';

// ----------------------------------------------------------------------

export type RHFUfFieldProps = Omit<RHFTextFieldProps, 'mask' | 'replacement' | 'maskPreset' | 'type'>;

export function RHFUfField(props: RHFUfFieldProps) {
  return <RHFTextField {...props} maskPreset="uf" />;
}
