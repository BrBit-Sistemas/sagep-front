import { RHFRating } from './rhf-rating';
import { RHFSlider } from './rhf-slider';
import { RHFUfField } from './rhf-uf-field';
import { RHFCepField } from './rhf-cep-field';
import { RHFCpfField } from './rhf-cpf-field';
import { RHFCnpjField } from './rhf-cnpj-field';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFUpload, RHFUploadAvatar } from './rhf-upload';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { RHFDatePicker, RHFTimePicker, RHFDateTimePicker } from './rhf-date-picker';

// ----------------------------------------------------------------------

export const Field = {
  Select: RHFSelect,
  Switch: RHFSwitch,
  Slider: RHFSlider,
  Rating: RHFRating,
  Text: RHFTextField,
  Checkbox: RHFCheckbox,
  RadioGroup: RHFRadioGroup,
  MultiSelect: RHFMultiSelect,
  MultiSwitch: RHFMultiSwitch,
  Autocomplete: RHFAutocomplete,
  MultiCheckbox: RHFMultiCheckbox,
  Cpf: RHFCpfField,
  Cnpj: RHFCnpjField,
  Cep: RHFCepField,
  Uf: RHFUfField,
  Upload: RHFUpload,
  UploadAvatar: RHFUploadAvatar,
  // Pickers
  DatePicker: RHFDatePicker,
  TimePicker: RHFTimePicker,
  DateTimePicker: RHFDateTimePicker,
};
