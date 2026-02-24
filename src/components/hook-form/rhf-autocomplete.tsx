import type { TextFieldProps } from '@mui/material/TextField';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

type Multiple = boolean | undefined;
type DisableClearable = boolean | undefined;
type FreeSolo = boolean | undefined;

type ExcludedProps = 'renderInput';
const EMPTY_ARRAY: any[] = [];

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, Multiple, DisableClearable, FreeSolo>,
  ExcludedProps
>;

export type RHFAutocompleteProps = AutocompleteBaseProps & {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  nullToEmptyString?: boolean;
  slotProps?: AutocompleteBaseProps['slotProps'] & {
    textField?: Partial<TextFieldProps>;
  };
};

export function RHFAutocomplete({
  name,
  label,
  slotProps,
  helperText,
  placeholder,
  nullToEmptyString,
  ...other
}: RHFAutocompleteProps) {
  const { control } = useFormContext();

  const { textField, ...otherSlotProps } = slotProps ?? {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = other.multiple
          ? (field.value ?? EMPTY_ARRAY)
          : field.value === '' || field.value === undefined
            ? null
            : field.value;

        return (
          <Autocomplete
            id={`${name}-rhf-autocomplete`}
            value={value}
            onBlur={field.onBlur}
            onChange={(_event, newValue) =>
              field.onChange(
                nullToEmptyString && (newValue === null || newValue === undefined) ? '' : newValue
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                {...textField}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message ?? helperText}
                inputProps={{
                  ...params.inputProps,
                  ...textField?.inputProps,
                  autoComplete: 'new-password', // Disable autocomplete and autofill
                }}
                slotProps={{
                  ...textField?.slotProps,
                }}
              />
            )}
            slotProps={{
              ...otherSlotProps,
              chip: {
                size: 'small',
                variant: 'soft',
                ...otherSlotProps?.chip,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
