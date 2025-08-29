import { useState } from 'react';

import {
  Grid,
  Card,
  Stack,
  Switch,
  Select,
  Button,
  Divider,
  MenuItem,
  TextField,
  FormGroup,
  Typography,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function ConfiguracoesDoSistemaPage() {
  const [tema, setTema] = useState<'system' | 'light' | 'dark'>('system');
  const [habilitarMFA, setHabilitarMFA] = useState<boolean>(false);
  const [manutencao, setManutencao] = useState<boolean>(false);

  // Unidade Prisional - Cores
  const [corPrimariaUP, setCorPrimariaUP] = useState<string>('#2E7D32');
  const [corSecundariaUP, setCorSecundariaUP] = useState<string>('#1565C0');
  const [corDestaqueUP, setCorDestaqueUP] = useState<string>('#FF6F00');

  // Tabela - Preferências
  const [pageSize, setPageSize] = useState<number>(10);
  const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');
  const [zebra, setZebra] = useState<boolean>(false);

  // Notificações
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [notifyPush, setNotifyPush] = useState<boolean>(false);

  const handleSalvar = () => {
    // TODO: Integrar com API quando disponível
    // Mantemos como no pattern das páginas: ação primária no topo/rodapé
    // Por ora, apenas um no-op
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Configurações do Sistema"
        links={[{ name: 'Sistema' }, { name: 'Configurações', href: paths.settings.root }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Preferências Gerais</Typography>
              <Divider />

              <FormControl fullWidth>
                <InputLabel id="tema-label">Tema</InputLabel>
                <Select
                  labelId="tema-label"
                  label="Tema"
                  value={tema}
                  onChange={(e) => setTema(e.target.value as typeof tema)}
                >
                  <MenuItem value="system">Automático (Sistema)</MenuItem>
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Escuro</MenuItem>
                </Select>
              </FormControl>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={habilitarMFA}
                      onChange={(e) => setHabilitarMFA(e.target.checked)}
                    />
                  }
                  label="Exigir MFA para todos os usuários"
                />
              </FormGroup>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Modo de Manutenção</Typography>
              <Divider />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={manutencao}
                      onChange={(e) => setManutencao(e.target.checked)}
                    />
                  }
                  label="Ativar manutenção (bloqueia acesso de usuários comuns)"
                />
              </FormGroup>
              <Typography variant="body2" color="text.secondary">
                Quando ativado, somente administradores poderão acessar o sistema.
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Personalização da Unidade Prisional</Typography>
              <Divider />

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  type="color"
                  label="Cor primária"
                  value={corPrimariaUP}
                  onChange={(e) => setCorPrimariaUP(e.target.value)}
                  inputProps={{ 'aria-label': 'Cor primária da Unidade Prisional' }}
                />
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: corPrimariaUP,
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  type="color"
                  label="Cor secundária"
                  value={corSecundariaUP}
                  onChange={(e) => setCorSecundariaUP(e.target.value)}
                  inputProps={{ 'aria-label': 'Cor secundária da Unidade Prisional' }}
                />
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: corSecundariaUP,
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  type="color"
                  label="Cor de destaque"
                  value={corDestaqueUP}
                  onChange={(e) => setCorDestaqueUP(e.target.value)}
                  inputProps={{ 'aria-label': 'Cor de destaque da Unidade Prisional' }}
                />
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: corDestaqueUP,
                  }}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Estas cores podem ser usadas para destacar cards, gráficos e cabeçalhos das Unidades
                Prisionais.
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Preferências da Tabela</Typography>
              <Divider />

              <FormControl fullWidth>
                <InputLabel id="page-size-label">Itens por página</InputLabel>
                <Select
                  labelId="page-size-label"
                  label="Itens por página"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="density-label">Densidade</InputLabel>
                <Select
                  labelId="density-label"
                  label="Densidade"
                  value={density}
                  onChange={(e) => setDensity(e.target.value as typeof density)}
                >
                  <MenuItem value="compact">Compacta</MenuItem>
                  <MenuItem value="standard">Padrão</MenuItem>
                  <MenuItem value="comfortable">Confortável</MenuItem>
                </Select>
              </FormControl>

              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={zebra} onChange={(e) => setZebra(e.target.checked)} />}
                  label="Linhas listradas (zebra)"
                />
              </FormGroup>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Notificações</Typography>
              <Divider />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                    />
                  }
                  label="Receber notificações por e-mail"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifyPush}
                      onChange={(e) => setNotifyPush(e.target.checked)}
                    />
                  }
                  label="Receber notificações push"
                />
              </FormGroup>
            </Stack>
          </Card>
        </Grid>

        {null}

        <Grid size={{ xs: 12 }}>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSalvar}>
              Salvar alterações
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
