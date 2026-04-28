import type { MaskOptions } from '@react-input/mask';
import type { TextFieldProps } from '@mui/material/TextField';
import type { FieldError, ControllerRenderProps } from 'react-hook-form';
import type { InputMaskPresetId } from 'src/utils/input-masks';

import { useMask } from '@react-input/mask';
import { Controller, useFormContext } from 'react-hook-form';
import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

import TextField from '@mui/material/TextField';

import { getInputMaskPreset } from 'src/utils/input-masks';

type MaskedFieldProps = {
  field: ControllerRenderProps;
  fieldError?: FieldError;
  helperText?: React.ReactNode;
  maskOptions: MaskOptions;
  maskPreset?: InputMaskPresetId;
  onChange?: TextFieldProps['onChange'];
  onBlur?: TextFieldProps['onBlur'];
  slotProps?: TextFieldProps['slotProps'];
} & Omit<TextFieldProps, 'onChange' | 'onBlur' | 'slotProps' | 'name'>;

function MaskedField({
  field,
  fieldError,
  helperText,
  maskOptions,
  maskPreset,
  onChange,
  onBlur,
  slotProps,
  ...other
}: MaskedFieldProps) {
  const maskRef = useMask(maskOptions);
  const displayValue = field.value === null || field.value === undefined ? '' : String(field.value);
  return (
    <TextField
      {...field}
      inputRef={maskRef}
      fullWidth
      value={displayValue}
      type="text"
      error={!!fieldError}
      helperText={fieldError?.message ?? helperText}
      onChange={(e) => {
        const value = maskPreset === 'uf' ? e.target.value.toUpperCase() : e.target.value;
        field.onChange(value);
        onChange?.(e);
      }}
      onBlur={(e) => {
        field.onBlur();
        onBlur?.(e);
      }}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...slotProps?.htmlInput,
          inputMode: maskPreset === 'uf' ? ('text' as const) : ('numeric' as const),
          autoComplete: 'new-password',
        },
      }}
      {...other}
    />
  );
}

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
  mask?: string;
  replacement?: MaskOptions['replacement'];
  /** Presets reutilizáveis: `src/utils/input-masks` (@react-input/mask). */
  maskPreset?: InputMaskPresetId;
};

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = 'text',
  mask,
  replacement,
  maskPreset,
  onChange,
  onBlur,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();
  const isNumberType = type === 'number';
  const presetOptions = maskPreset ? getInputMaskPreset(maskPreset) : null;
  const effectiveMask = mask ?? presetOptions?.mask;
  const effectiveReplacement = replacement ?? presetOptions?.replacement;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (effectiveMask) {
          const maskOptions: MaskOptions = {
            mask: effectiveMask,
            replacement: effectiveReplacement ?? {},
            ...(presetOptions?.showMask != null ? { showMask: presetOptions.showMask } : {}),
            ...(presetOptions?.separate != null ? { separate: presetOptions.separate } : {}),
            ...(presetOptions?.track != null ? { track: presetOptions.track } : {}),
            ...(presetOptions?.modify != null ? { modify: presetOptions.modify } : {}),
          };
          return (
            <MaskedField
              field={field}
              fieldError={error}
              helperText={helperText}
              maskOptions={maskOptions}
              maskPreset={maskPreset}
              onChange={onChange}
              onBlur={onBlur}
              slotProps={slotProps}
              {...other}
            />
          );
        }

        return (
          <TextField
            {...field}
            fullWidth
            value={isNumberType ? transformValue(field.value) : field.value}
            onChange={(event) => {
              const transformedValue = isNumberType
                ? transformValueOnChange(event.target.value)
                : event.target.value;

              field.onChange(transformedValue);
              onChange?.(event);
            }}
            onBlur={(event) => {
              const transformedValue = isNumberType
                ? transformValueOnBlur(event.target.value)
                : event.target.value;

              field.onChange(transformedValue);
              field.onBlur();
              onBlur?.(event);
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
