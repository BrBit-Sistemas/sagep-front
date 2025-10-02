import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { getAutenticação } from 'src/api/autenticação/autenticação';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço de e-mail válido!' }),
  password: zod
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const location = useLocation();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    const state = (location.state || {}) as { notice?: string };
    if (state.notice) {
      setNoticeMessage(state.notice);
      // Clear the state to avoid showing it again on refresh/navigation
      router.replace(paths.auth.jwt.signIn, { state: {} });
    }
  }, []);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      // After session is set, fetch current user to decide redirect
      try {
        const authApi = getAutenticação();
        const me = await authApi.me();

        const isAdmin = Boolean((me as any)?.isAdmin);

        const hasPermission = (action: string, subject: string) =>
          Boolean(
            (me as any)?.roles?.some((role: any) =>
              role?.permissions?.some(
                (perm: any) => perm?.action === action && perm?.subject === subject
              )
            )
          );

        if (isAdmin) {
          router.replace(paths.detentos.root);
          return;
        }

        const candidates: { allowed: boolean; path: string }[] = [
          { allowed: hasPermission('read', 'detentos'), path: paths.detentos.root },
          { allowed: hasPermission('read', 'usuarios'), path: paths.users.root },
          {
            allowed: hasPermission('read', 'unidades_prisionais'),
            path: paths.unidadesPrisionais.root,
          },
          { allowed: hasPermission('read', 'regionais'), path: paths.regionais.root },
          { allowed: hasPermission('read', 'secretarias'), path: paths.secretarias.root },
          { allowed: hasPermission('read', 'profissoes'), path: paths.profissoes.root },
          {
            allowed:
              hasPermission('read', 'ficha_cadastral_interno') ||
              hasPermission('read', 'ficha_cadastral_externo'),
            path: `${paths.dashboard.root}/ficha-cadastral`,
          },
        ];

        const firstAllowed = candidates.find((c) => c.allowed);
        router.replace(firstAllowed?.path ?? paths.dashboard.root);
      } catch {
        // Fallback: if we can't determine permissions, go to dashboard
        router.replace(paths.dashboard.root);
      }
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Endereço de e-mail"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={RouterLink}
          href={paths.auth.jwt.forgotPassword}
          variant="body2"
          sx={{ alignSelf: 'flex-end' }}
        >
          Esqueceu a senha?
        </Link>

        <Field.Text
          name="password"
          label="Senha"
          placeholder="6+ caracteres"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
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
      </Box>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Entrando..."
      >
        Entrar
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Acesse sua conta"
        description={
          <>
            {`Sem acesso para preencher uma ficha cadastral? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Cadastre-se.
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!noticeMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {noticeMessage}
        </Alert>
      )}

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
