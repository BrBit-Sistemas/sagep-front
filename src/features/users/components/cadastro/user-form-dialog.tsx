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
  email: '',
  avatarUrl: null,
  senha: '',
  confirmarSenha: '',
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
  const showConfirmPassword = useBoolean();

  const { data: { items: regionais } = { items: [] } } = useListRegionais({
    page: 0,
    limit: 1000,
  });

  const { data: { items: secretarias } = { items: [] } } = useListSecretarias({
    page: 0,
    limit: 1000,
  });

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 0,
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
      if (isEditing) {
        await updateUser(data as UpdateUserSchema);
      } else {
        await createUser(data as CreateUserSchema);
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
    methods.setValue('regionalId', undefined);
    methods.setValue('unidadeId', undefined);
  }, [secretariaId, methods]);

  useEffect(() => {
    // When regional changes, clear unidade selection
    methods.setValue('unidadeId', undefined);
  }, [regionalId, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Usuário</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Preencha os campos abaixo para {isEditing ? 'editar' : 'adicionar'} um novo usuário.
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          * Campos obrigatórios
        </Typography>

        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Field.UploadAvatar name="avatarUrl" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Field.Text required name="nome" label="Nome Completo" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text required name="email" label="Endereço de Email" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select required name="secretariaId" label="Secretaria">
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

            <Grid size={{ xs: 12, md: 6 }}>
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
                required={!isEditing}
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
                required={!isEditing}
                label="Confirmar Senha"
                type={showConfirmPassword.value ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                          <Iconify
                            icon={
                              showConfirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                            }
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
