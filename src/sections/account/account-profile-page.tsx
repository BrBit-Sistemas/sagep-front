import type { ReadUsuarioDto } from 'src/api/generated.schemas';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Grid, Card, Stack, Button, Divider, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { customInstance } from 'src/lib/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { getAutenticação } from 'src/api/autenticação/autenticação';

import { UploadAvatar } from 'src/components/upload/upload-avatar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AvatarCropDialog } from 'src/components/avatar/avatar-crop-dialog';

import { useAuthContext } from 'src/auth/hooks';

import { AccountChangePassword } from './account-change-password';

export default function AccountProfilePage() {
  const authApi = getAutenticação();
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  const { data: me } = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [avatarDirty, setAvatarDirty] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  useEffect(() => {
    if (!me) return;
    setNome(me?.nome ?? '');
    setEmail(me?.email ?? '');
    setAvatarPreview(me?.avatarUrl ?? null);
    setAvatarFile(null);
    setAvatarDirty(false);
  }, [me?.avatarUrl, me?.email, me?.nome]);

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
    setAvatarDirty(true);
  }, []);

  const handleCloseCrop = useCallback(() => {
    setIsCropOpen(false);
    setCropImageSrc(null);
  }, []);

  const handleResetAvatar = useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview(me?.avatarUrl ?? null);
    setAvatarDirty(false);
  }, [me?.avatarUrl]);

  const handleSaveAvatar = useCallback(async () => {
    if (!avatarFile) return;
    setIsSavingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', avatarFile);

      const updatedUser = await customInstance<ReadUsuarioDto>({
        url: '/auth/me/avatar',
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      });

      queryClient.setQueryData<ReadUsuarioDto | undefined>(['me'], updatedUser);
      // Invalidar outros caches para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      if (updatedUser.id) {
        queryClient.invalidateQueries({ queryKey: ['usuario', updatedUser.id] });
      }
      
      // Forçar refetch imediato e agressivo
      await queryClient.refetchQueries({ queryKey: ['me'] });
      
      // Aguardar um pouco e forçar novamente para garantir propagação
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['me'] });
      }, 100);
      
      setAvatarPreview(updatedUser.avatarUrl ?? null);
      setAvatarFile(null);
      setAvatarDirty(false);
      setUser?.({ avatar_url: updatedUser.avatarUrl ?? '' });
    } catch (error) {
      console.error('Falha ao atualizar a foto de perfil', error);
    } finally {
      setIsSavingAvatar(false);
    }
  }, [avatarFile, queryClient, setUser]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[{ name: 'Dashboard' }, { name: 'Perfil', href: `${paths.dashboard.root}/perfil` }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h6">Foto de perfil</Typography>
              <Divider sx={{ width: 1 }} />
              <UploadAvatar
                value={avatarPreview ?? ''}
                disabled={isSavingAvatar}
                maxSize={5 * 1024 * 1024}
                onDrop={handleAvatarDrop}
                accept={{ 'image/*': [] }}
              />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Utilize uma imagem quadrada para obter o melhor recorte. Você poderá ajustar o zoom
                antes de salvar.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleResetAvatar}
                  disabled={!avatarDirty || isSavingAvatar}
                >
                  Redefinir
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveAvatar}
                  disabled={!avatarDirty || isSavingAvatar}
                >
                  {isSavingAvatar ? 'Salvando...' : 'Salvar foto'}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Informações pessoais</Typography>
              <Divider />
              <TextField
                label="Nome"
                disabled
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                label="E-mail"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" disabled>
                  Salvar
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Alterar senha</Typography>
              <Divider />
              <AccountChangePassword />
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <AvatarCropDialog
        open={isCropOpen}
        imageSrc={cropImageSrc}
        onClose={handleCloseCrop}
        onComplete={handleCropComplete}
      />
    </DashboardContent>
  );
}
