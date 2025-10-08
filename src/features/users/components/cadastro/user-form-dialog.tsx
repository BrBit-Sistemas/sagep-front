import type { z } from 'zod';
import type { CreateUserSchema, UpdateUserSchema } from 'src/features/users/schemas';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { useCreateUser } from 'src/features/users/hooks/use-create-user';
import { useUpdateUser } from 'src/features/users/hooks/use-update-user';
import { createUserSchema, updateUserSchema } from 'src/features/users/schemas';
import { useListRegionais } from 'src/features/regionais/hooks/use-list-regionais';
import { useListSecretarias } from 'src/features/secretarias/hooks/use-list-secretaria';
import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

type UserFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: UpdateUserSchema;
  userId?: string;
};

const INITIAL_VALUES: CreateUserSchema = {
  nome: '',
  cpf: '',
  email: '',
  avatarUrl: null,
  senha: '',
  confirmarSenha: '',
  regionalId: '',
  secretariaId: '',
  unidadeId: '',
};

const getFormSchema = (isEditing: boolean) => (isEditing ? updateUserSchema : createUserSchema);

export const UserFormDialog = ({
  onSuccess,
  onClose,
  open,
  defaultValues,
  userId,
}: UserFormDialogProps) => {
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const showPassword = useBoolean();

  const { data: { items: regionais } = { items: [] } } = useListRegionais({
    page: 1,
    limit: 1000,
  });

  const { data: { items: secretarias } = { items: [] } } = useListSecretarias({
    page: 1,
    limit: 1000,
  });

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 1,
    limit: 1000,
  });

  const isEditing = !!userId;
  const isLoading = isCreating || isUpdating;

  const schema = getFormSchema(isEditing);
  type FormSchema = z.infer<typeof schema>;

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // Convert empty strings to null for optional fields (backend expects null, not undefined)
      const sanitizedData = {
        ...data,
        regionalId: data.regionalId && data.regionalId.trim() !== '' ? data.regionalId : null,
        secretariaId: data.secretariaId && data.secretariaId.trim() !== '' ? data.secretariaId : null,
        unidadeId: data.unidadeId && data.unidadeId.trim() !== '' ? data.unidadeId : null,
      };

      if (isEditing) {
        await updateUser(sanitizedData as UpdateUserSchema);
      } else {
        await createUser(sanitizedData as CreateUserSchema);
      }
      methods.reset(INITIAL_VALUES);
      onSuccess();
    } catch (error: any) {
      // Handle field errors
      if (error.fieldErrors && Array.isArray(error.fieldErrors)) {
        error.fieldErrors.forEach((fieldError: any) => {
          methods.setError(fieldError.field as any, {
            type: 'server',
            message: fieldError.message,
          });
        });
      }
    }
  });

  const [regionalId, secretariaId] = methods.watch(['regionalId', 'secretariaId']);

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  useEffect(() => {
    // When secretaria changes, clear regional and unidade selections
    methods.setValue('regionalId', '');
    methods.setValue('unidadeId', '');
  }, [secretariaId, methods]);

  useEffect(() => {
    // When regional changes, clear unidade selection
    methods.setValue('unidadeId', '');
  }, [regionalId, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Usuário</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Preencha os campos abaixo para {isEditing ? 'editar' : 'adicionar'} um novo usuário.
        </Typography>

        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Field.UploadAvatar name="avatarUrl" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Field.Text name="nome" label="Nome Completo" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="cpf"
                label="CPF"
                placeholder="00000000000"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text name="email" label="Endereço de Email" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="secretariaId" label="Secretaria">
                {secretarias.map((secretaria) => (
                  <MenuItem key={secretaria.id} value={secretaria.id}>
                    {secretaria.nome}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                name="regionalId"
                label="Regional"
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={isLoading || !regionais?.length}
              >
                {regionais.map((regional) => (
                  <MenuItem key={regional.id} value={regional.id}>
                    {regional.nome}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Field.Select
                name="unidadeId"
                label="Unidade Prisional"
                disabled={!secretariaId || !regionalId}
              >
                {unidades.map((unidade) => (
                  <MenuItem key={unidade.id} value={unidade.id}>
                    {unidade.nome}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Field.Text
                name="senha"
                label="Senha"
                type={showPassword.value ? 'text' : 'password'}
                helperText={isEditing ? 'Deixe em branco para não alterar' : ''}
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
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Field.Text 
                name="confirmarSenha" 
                label="Confirmar Senha" 
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
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary" disabled={isLoading}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
