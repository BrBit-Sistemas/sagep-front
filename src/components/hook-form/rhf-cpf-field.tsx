import type { RHFTextFieldProps } from './rhf-text-field';

import { RHFTextField } from './rhf-text-field';

// ----------------------------------------------------------------------

export type RHFCpfFieldProps = Omit<RHFTextFieldProps, 'mask' | 'maskChar' | 'type'>;

export function RHFCpfField(props: RHFCpfFieldProps) {
  return <RHFTextField {...props} mask="___.___.___-__" replacement={{ _: /\d/ }} />;
}
