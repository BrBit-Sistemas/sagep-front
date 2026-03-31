import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Card,
  Grid,
  Alert,
  Stack,
  Table,
  Button,
  Dialog,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { handleError } from 'src/utils/handle-error';

import { DashboardContent } from 'src/layouts/dashboard';
import { getTrabalhoPenalCatalog } from 'src/api/trabalho-penal/trabalho-penal-catalog';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

type ModeloForm = {
  nome: string;
  usa_nivel: boolean;
  tipo_calculo: 'MENSAL' | 'HORA' | 'HIBRIDO';
  nivel_I: string;
  nivel_II: string;
  nivel_III: string;
};

type PoliticaForm = {
  tipo_transporte: 'FUNAP' | 'EMPRESA' | 'NENHUM';
  tipo_alimentacao: 'FUNAP' | 'EMPRESA' | 'NENHUM';
  valor_transporte_padrao: string;
  valor_alimentacao_padrao: string;
  variavel_por_dia: boolean;
};

const INITIAL_MODELO: ModeloForm = {
  nome: '',
  usa_nivel: true,
  tipo_calculo: 'MENSAL',
  nivel_I: '0',
  nivel_II: '0',
  nivel_III: '0',
};

const INITIAL_POLITICA: PoliticaForm = {
  tipo_transporte: 'FUNAP',
  tipo_alimentacao: 'FUNAP',
  valor_transporte_padrao: '0',
  valor_alimentacao_padrao: '0',
  variavel_por_dia: true,
};

const keys = {
  modelos: ['trabalho-penal-modelos'] as const,
  politicas: ['trabalho-penal-politicas'] as const,
};

export default function TrabalhoPenalCatalogosPage() {
  const api = getTrabalhoPenalCatalog();
  const queryClient = useQueryClient();

  const [modeloOpen, setModeloOpen] = useState(false);
  const [politicaOpen, setPoliticaOpen] = useState(false);
  const [modeloEditId, setModeloEditId] = useState<string | null>(null);
  const [politicaEditId, setPoliticaEditId] = useState<string | null>(null);
  const [modeloForm, setModeloForm] = useState<ModeloForm>(INITIAL_MODELO);
  const [politicaForm, setPoliticaForm] = useState<PoliticaForm>(INITIAL_POLITICA);

  const modelosQuery = useQuery({
    queryKey: keys.modelos,
    queryFn: () => api.listModelosRemuneracao(),
  });

  const politicasQuery = useQuery({
    queryKey: keys.politicas,
    queryFn: () => api.listPoliticasBeneficio(),
  });

  const modeloSaveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        nome: modeloForm.nome,
        usa_nivel: modeloForm.usa_nivel,
        tipo_calculo: modeloForm.tipo_calculo,
        niveis: [
          { nivel: 'I' as const, valor_bolsa: Number(modeloForm.nivel_I || 0) },
          { nivel: 'II' as const, valor_bolsa: Number(modeloForm.nivel_II || 0) },
          { nivel: 'III' as const, valor_bolsa: Number(modeloForm.nivel_III || 0) },
        ],
      };
      if (modeloEditId) {
        return api.updateModeloRemuneracao(modeloEditId, payload);
      }
      return api.createModeloRemuneracao(payload);
    },
    onSuccess: () => {
      setModeloOpen(false);
      setModeloEditId(null);
      setModeloForm(INITIAL_MODELO);
      void queryClient.invalidateQueries({ queryKey: keys.modelos });
    },
  });

  const politicaSaveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        tipo_transporte: politicaForm.tipo_transporte,
        tipo_alimentacao: politicaForm.tipo_alimentacao,
        valor_transporte_padrao: Number(politicaForm.valor_transporte_padrao || 0),
        valor_alimentacao_padrao: Number(politicaForm.valor_alimentacao_padrao || 0),
        variavel_por_dia: politicaForm.variavel_por_dia,
      };
      if (politicaEditId) {
        return api.updatePoliticaBeneficio(politicaEditId, payload);
      }
      return api.createPoliticaBeneficio(payload);
    },
    onSuccess: () => {
      setPoliticaOpen(false);
      setPoliticaEditId(null);
      setPoliticaForm(INITIAL_POLITICA);
      void queryClient.invalidateQueries({ queryKey: keys.politicas });
    },
  });

  const modeloDeleteMutation = useMutation({
    mutationFn: async (id: string) => api.removeModeloRemuneracao(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.modelos });
    },
  });

  const politicaDeleteMutation = useMutation({
    mutationFn: async (id: string) => api.removePoliticaBeneficio(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.politicas });
    },
  });

  const modeloError = useMemo(
    () =>
      handleError(
        modelosQuery.error || modeloSaveMutation.error || modeloDeleteMutation.error,
      ),
    [modelosQuery.error, modeloSaveMutation.error, modeloDeleteMutation.error],
  );

  const politicaError = useMemo(
    () =>
      handleError(
        politicasQuery.error || politicaSaveMutation.error || politicaDeleteMutation.error,
      ),
    [
      politicasQuery.error,
      politicaSaveMutation.error,
      politicaDeleteMutation.error,
    ],
  );

  const openCreateModelo = () => {
    setModeloEditId(null);
    setModeloForm(INITIAL_MODELO);
    setModeloOpen(true);
  };

  const openEditModelo = (id: string) => {
    const item = modelosQuery.data?.find((row) => row.modelo_remuneracao_id === id);
    if (!item) return;
    const i = item.niveis.find((nivel) => nivel.nivel === 'I')?.valor_bolsa ?? 0;
    const ii = item.niveis.find((nivel) => nivel.nivel === 'II')?.valor_bolsa ?? 0;
    const iii = item.niveis.find((nivel) => nivel.nivel === 'III')?.valor_bolsa ?? 0;
    setModeloEditId(item.modelo_remuneracao_id);
    setModeloForm({
      nome: item.nome,
      usa_nivel: item.usa_nivel,
      tipo_calculo: item.tipo_calculo,
      nivel_I: String(i),
      nivel_II: String(ii),
      nivel_III: String(iii),
    });
    setModeloOpen(true);
  };

  const openCreatePolitica = () => {
    setPoliticaEditId(null);
    setPoliticaForm(INITIAL_POLITICA);
    setPoliticaOpen(true);
  };

  const openEditPolitica = (id: string) => {
    const item = politicasQuery.data?.find(
      (row) => row.politica_beneficio_id === id,
    );
    if (!item) return;
    setPoliticaEditId(item.politica_beneficio_id);
    setPoliticaForm({
      tipo_transporte: item.tipo_transporte,
      tipo_alimentacao: item.tipo_alimentacao,
      valor_transporte_padrao: String(item.valor_transporte_padrao),
      valor_alimentacao_padrao: String(item.valor_alimentacao_padrao),
      variavel_por_dia: item.variavel_por_dia,
    });
    setPoliticaOpen(true);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Núcleo Trabalho Penal"
        links={[
          { name: 'Laboral' },
          { name: 'Convênios', href: paths.empresaConvenios.root },
          { name: 'Catálogo' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Modelos de remuneração</Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={openCreateModelo}
              >
                Novo modelo
              </Button>
            </Stack>
            {modeloError && <Alert severity="error" sx={{ mb: 2 }}>{modeloError}</Alert>}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo cálculo</TableCell>
                  <TableCell>Usa nível</TableCell>
                  <TableCell>Níveis</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(modelosQuery.data ?? []).map((row) => (
                  <TableRow key={row.modelo_remuneracao_id}>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.tipo_calculo}</TableCell>
                    <TableCell>{row.usa_nivel ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      {row.niveis.map((nivel) => `${nivel.nivel}: ${nivel.valor_bolsa}`).join(' · ')}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button onClick={() => openEditModelo(row.modelo_remuneracao_id)}>
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => modeloDeleteMutation.mutate(row.modelo_remuneracao_id)}
                        >
                          Excluir
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Políticas de benefício</Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={openCreatePolitica}
              >
                Nova política
              </Button>
            </Stack>
            {politicaError && <Alert severity="error" sx={{ mb: 2 }}>{politicaError}</Alert>}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Transporte</TableCell>
                  <TableCell>Alimentação</TableCell>
                  <TableCell>Valor transporte</TableCell>
                  <TableCell>Valor alimentação</TableCell>
                  <TableCell>Variável/dia</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(politicasQuery.data ?? []).map((row) => (
                  <TableRow key={row.politica_beneficio_id}>
                    <TableCell>{row.tipo_transporte}</TableCell>
                    <TableCell>{row.tipo_alimentacao}</TableCell>
                    <TableCell>{row.valor_transporte_padrao}</TableCell>
                    <TableCell>{row.valor_alimentacao_padrao}</TableCell>
                    <TableCell>{row.variavel_por_dia ? 'Sim' : 'Não'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button onClick={() => openEditPolitica(row.politica_beneficio_id)}>
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() =>
                            politicaDeleteMutation.mutate(row.politica_beneficio_id)
                          }
                        >
                          Excluir
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={modeloOpen} onClose={() => setModeloOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{modeloEditId ? 'Editar modelo' : 'Novo modelo'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              value={modeloForm.nome}
              onChange={(e) => setModeloForm((prev) => ({ ...prev, nome: e.target.value }))}
            />
            <TextField
              select
              label="Tipo de cálculo"
              value={modeloForm.tipo_calculo}
              onChange={(e) =>
                setModeloForm((prev) => ({
                  ...prev,
                  tipo_calculo: e.target.value as ModeloForm['tipo_calculo'],
                }))
              }
            >
              <MenuItem value="MENSAL">MENSAL</MenuItem>
              <MenuItem value="HORA">HORA</MenuItem>
              <MenuItem value="HIBRIDO">HIBRIDO</MenuItem>
            </TextField>
            <TextField
              select
              label="Usa nível"
              value={modeloForm.usa_nivel ? 'true' : 'false'}
              onChange={(e) =>
                setModeloForm((prev) => ({ ...prev, usa_nivel: e.target.value === 'true' }))
              }
            >
              <MenuItem value="true">Sim</MenuItem>
              <MenuItem value="false">Não</MenuItem>
            </TextField>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Nível I"
                type="number"
                value={modeloForm.nivel_I}
                onChange={(e) =>
                  setModeloForm((prev) => ({ ...prev, nivel_I: e.target.value }))
                }
              />
              <TextField
                label="Nível II"
                type="number"
                value={modeloForm.nivel_II}
                onChange={(e) =>
                  setModeloForm((prev) => ({ ...prev, nivel_II: e.target.value }))
                }
              />
              <TextField
                label="Nível III"
                type="number"
                value={modeloForm.nivel_III}
                onChange={(e) =>
                  setModeloForm((prev) => ({ ...prev, nivel_III: e.target.value }))
                }
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModeloOpen(false)} type="button">Cancelar</Button>
          <Button
            onClick={() => modeloSaveMutation.mutate()}
            disabled={modeloSaveMutation.isPending || !modeloForm.nome.trim()}
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={politicaOpen} onClose={() => setPoliticaOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{politicaEditId ? 'Editar política' : 'Nova política'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Tipo transporte"
              value={politicaForm.tipo_transporte}
              onChange={(e) =>
                setPoliticaForm((prev) => ({
                  ...prev,
                  tipo_transporte: e.target.value as PoliticaForm['tipo_transporte'],
                }))
              }
            >
              <MenuItem value="FUNAP">FUNAP</MenuItem>
              <MenuItem value="EMPRESA">EMPRESA</MenuItem>
              <MenuItem value="NENHUM">NENHUM</MenuItem>
            </TextField>
            <TextField
              select
              label="Tipo alimentação"
              value={politicaForm.tipo_alimentacao}
              onChange={(e) =>
                setPoliticaForm((prev) => ({
                  ...prev,
                  tipo_alimentacao: e.target.value as PoliticaForm['tipo_alimentacao'],
                }))
              }
            >
              <MenuItem value="FUNAP">FUNAP</MenuItem>
              <MenuItem value="EMPRESA">EMPRESA</MenuItem>
              <MenuItem value="NENHUM">NENHUM</MenuItem>
            </TextField>
            <TextField
              label="Valor transporte padrão"
              type="number"
              value={politicaForm.valor_transporte_padrao}
              onChange={(e) =>
                setPoliticaForm((prev) => ({
                  ...prev,
                  valor_transporte_padrao: e.target.value,
                }))
              }
            />
            <TextField
              label="Valor alimentação padrão"
              type="number"
              value={politicaForm.valor_alimentacao_padrao}
              onChange={(e) =>
                setPoliticaForm((prev) => ({
                  ...prev,
                  valor_alimentacao_padrao: e.target.value,
                }))
              }
            />
            <TextField
              select
              label="Variável por dia"
              value={politicaForm.variavel_por_dia ? 'true' : 'false'}
              onChange={(e) =>
                setPoliticaForm((prev) => ({
                  ...prev,
                  variavel_por_dia: e.target.value === 'true',
                }))
              }
            >
              <MenuItem value="true">Sim</MenuItem>
              <MenuItem value="false">Não</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPoliticaOpen(false)} type="button">Cancelar</Button>
          <Button
            onClick={() => politicaSaveMutation.mutate()}
            disabled={politicaSaveMutation.isPending}
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
