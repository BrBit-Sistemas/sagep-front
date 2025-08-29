import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { CONFIG } from 'src/global-config';

import { Form, Field } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';
import { forgotPassword } from 'src/auth/context/jwt/action';

const metadata = { title: `Esqueci a senha | ${CONFIG.appName}` };

const Schema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço de e-mail válido!' }),
});

type SchemaType = zod.infer<typeof Schema>;

export default function Page() {
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: { email: '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword({ email: data.email });
      setSuccess('Se o e-mail existir, enviaremos instruções de redefinição.');
      setErrorMessage(null);
    } catch (error) {
      setSuccess(null);
      setErrorMessage(getErrorMessage(error));
    }
  });

  return (
    <>
      <title>{metadata.title}</title>
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      {!!success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Text
            name="email"
            label="Endereço de e-mail"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Enviar
          </Button>
        </Stack>
      </Form>
    </>
  );
}
