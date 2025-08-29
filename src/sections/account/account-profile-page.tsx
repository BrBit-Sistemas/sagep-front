import { useState, useEffect } from 'react';

import { Grid, Card, Stack, Button, Divider, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAutenticação } from 'src/api/autenticação/autenticação';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AccountChangePassword } from './account-change-password';

export default function AccountProfilePage() {
  const authApi = getAutenticação();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await authApi.me();
        if (!active) return;
        setNome((me as any)?.nome ?? '');
        setEmail((me as any)?.email ?? '');
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    // TODO: Integrate with usuarios update (self) when available
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[{ name: 'Dashboard' }, { name: 'Perfil', href: `${paths.dashboard.root}/perfil` }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
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
                <Button variant="contained" onClick={handleSave}>
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
    </DashboardContent>
  );
}
