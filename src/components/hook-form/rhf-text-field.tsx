import type { MaskOptions } from '@react-input/mask';
import type { TextFieldProps } from '@mui/material/TextField';

import { InputMask } from '@react-input/mask';
import { Controller, useFormContext } from 'react-hook-form';
import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

import TextField from '@mui/material/TextField';

function MaskedInput(props: MaskOptions) {
  const { mask, replacement, ...rest } = props;
  return <InputMask mask={mask} replacement={replacement} {...rest} />;
}

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
  mask?: string;
  replacement?: MaskOptions['replacement'];
};

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = 'text',
  mask,
  replacement,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();
  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (mask) {
          return (
            <TextField
              name={field.name}
              fullWidth
              value={field.value || ''}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
              type={type}
              error={!!error}
              helperText={error?.message ?? helperText}
              slotProps={{
                ...slotProps,
                htmlInput: {
                  ...slotProps?.htmlInput,
                  autoComplete: 'new-password',
                },
              }}
              InputProps={{
                inputComponent: MaskedInput as any,
                inputProps: {
                  mask,
                  replacement,
                },
              }}
              {...other}
            />
          );
        }

        return (
          <TextField
            name={field.name}
            fullWidth
            value={isNumberType ? transformValue(field.value) : field.value}
            onChange={(event) => {
              const transformedValue = isNumberType
                ? transformValueOnChange(event.target.value)
                : event.target.value;

              field.onChange(transformedValue);
            }}
            onBlur={(event) => {
              const transformedValue = isNumberType
                ? transformValueOnBlur(event.target.value)
                : event.target.value;

              field.onChange(transformedValue);
              field.onBlur();
            }}
            type={isNumberType ? 'text' : type}
            error={!!error}
            helperText={error?.message ?? helperText}
            slotProps={{
              ...slotProps,
              htmlInput: {
                ...slotProps?.htmlInput,
                ...(isNumberType && {
                  inputMode: 'decimal',
                  pattern: '[0-9]*\\.?[0-9]*',
                }),
                autoComplete: 'new-password',
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
