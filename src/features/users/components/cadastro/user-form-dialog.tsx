import type { z } from 'zod';
import type { CreateUserSchema, UpdateUserSchema } from 'src/features/users/schemas';

import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

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
import { UploadAvatar } from 'src/components/upload/upload-avatar';
import { AvatarCropDialog } from 'src/components/avatar/avatar-crop-dialog';

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
  const queryClient = useQueryClient();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();

  // Avatar crop states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

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

  // Avatar handlers
  const handleAvatarDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setCropImageSrc(result);
        setIsCropOpen(true);
      }
    });
    reader.readAsDataURL(file);
  }, []);

  const handleCropComplete = useCallback((result: { file: File; dataUrl: string }) => {
    setAvatarFile(result.file);
    setAvatarPreview(result.dataUrl);
    setIsCropOpen(false);
    setCropImageSrc(null);
  }, []);

  const handleCloseCrop = useCallback(() => {
    setIsCropOpen(false);
    setCropImageSrc(null);
  }, []);

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // Convert empty strings to null for optional fields (backend expects null, not undefined)
      const sanitizedData = {
        ...data,
        regionalId: data.regionalId && data.regionalId.trim() !== '' ? data.regionalId : null,
        secretariaId:
          data.secretariaId && data.secretariaId.trim() !== '' ? data.secretariaId : null,
        unidadeId: data.unidadeId && data.unidadeId.trim() !== '' ? data.unidadeId : null,
        avatarFile, // Include the avatar file
      };

      if (isEditing) {
        await updateUser(sanitizedData as UpdateUserSchema & { avatarFile?: File | null });
      } else {
        await createUser(sanitizedData as CreateUserSchema & { avatarFile?: File | null });
      }

      // Invalidar cache para atualizar avatar em todos os lugares
      console.log('Invalidating cache after user update');

      // Invalidar todas as queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['usuario', userId] });
      }

      // Forçar refetch imediato e agressivo
      await queryClient.refetchQueries({ queryKey: ['me'] });

      // Aguardar um pouco e forçar novamente para garantir propagação
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['me'] });
      }, 100);

      methods.reset(INITIAL_VALUES);
      setAvatarFile(null);
      setAvatarPreview(null);
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
    if (isEditing) {
      console.log('Loading user for edit:', defaultValues);
      console.log('Avatar URL:', defaultValues?.avatarUrl);
      methods.reset(defaultValues);
      // Load existing avatar if available
      setAvatarPreview((defaultValues?.avatarUrl as string | null) || null);
      setAvatarFile(null);
    } else {
      methods.reset(INITIAL_VALUES);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
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

  // Reset avatar states when dialog closes
  useEffect(() => {
    if (!open) {
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsCropOpen(false);
      setCropImageSrc(null);
    }
  }, [open]);

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
              <UploadAvatar
                value={avatarPreview ?? ''}
                disabled={isLoading}
                maxSize={5 * 1024 * 1024}
                onDrop={handleAvatarDrop}
                accept={{ 'image/*': [] }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Field.Text required name="nome" label="Nome Completo" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="cpf"
                required
                label="CPF"
                placeholder="00000000000"
                slotProps={{ inputLabel: { shrink: true } }}
              />
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

      <AvatarCropDialog
        open={isCropOpen}
        imageSrc={cropImageSrc}
        onClose={handleCloseCrop}
        onComplete={handleCropComplete}
      />
    </Dialog>
  );
};
