import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { Form, Field } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';
import { resetPassword } from 'src/auth/context/jwt/action';

const metadata = { title: `Redefinir senha | ${CONFIG.appName}` };

const Schema = zod
  .object({
    password: zod.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
    confirmPassword: zod.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type SchemaType = zod.infer<typeof Schema>;

export default function Page() {
  const params = useSearchParams();
  const token = params.get('token') || '';

  const [success, setSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword({ token, newPassword: data.password });
      setSuccess('Senha redefinida com sucesso. Você já pode entrar.');
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
            name="password"
            type="password"
            label="Nova senha"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Field.Text
            name="confirmPassword"
            type="password"
            label="Confirmar nova senha"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Redefinir senha
          </Button>
        </Stack>
      </Form>
    </>
  );
}
