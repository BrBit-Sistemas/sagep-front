import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { getAutenticação } from 'src/api/autenticação/autenticação';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

export type ChangePassWordSchemaType = zod.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(1, { message: 'Senha atual é obrigatória!' })
      .min(6, { message: 'Senha deve ter pelo menos 6 caracteres!' }),
    newPassword: zod
      .string()
      .min(1, { message: 'Nova senha é obrigatória!' })
      .min(6, { message: 'Senha deve ter pelo menos 6 caracteres!' }),
    confirmNewPassword: zod.string().min(1, { message: 'Confirmação de senha é obrigatória!' }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Nova senha deve ser diferente da atual',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem!',
    path: ['confirmNewPassword'],
  });

export function AccountChangePassword() {
  const showPassword = useBoolean();
  const authApi = getAutenticação();

  const defaultValues: ChangePassWordSchemaType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm<ChangePassWordSchemaType>({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      reset();
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível alterar a senha');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Field.Text
          name="oldPassword"
          type={showPassword.value ? 'text' : 'password'}
          label="Senha atual"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Field.Text
          name="newPassword"
          label="Nova senha"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Field.Text
          name="confirmNewPassword"
          type={showPassword.value ? 'text' : 'password'}
          label="Confirmar nova senha"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Salvar alteração
        </LoadingButton>
      </Card>
    </Form>
  );
}
