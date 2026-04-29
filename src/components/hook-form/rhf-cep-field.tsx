import type { RHFTextFieldProps } from './rhf-text-field';

import { RHFTextField } from './rhf-text-field';

// ----------------------------------------------------------------------

export type RHFCepFieldProps = Omit<RHFTextFieldProps, 'mask' | 'replacement' | 'maskPreset' | 'type'>;

export function RHFCepField(props: RHFCepFieldProps) {
  return <RHFTextField {...props} maskPreset="cep" />;
}
