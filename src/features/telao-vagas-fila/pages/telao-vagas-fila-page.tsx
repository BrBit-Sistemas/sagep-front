import type { FilaItemTelao } from 'src/api/telao-vagas-fila/telao-vagas-fila';

import { useMemo, useState, useCallback, type ReactElement } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { getTelaoVagasFila } from 'src/api/telao-vagas-fila/telao-vagas-fila';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

const api = getTelaoVagasFila();

const PAGE_SIZE = 8;

const REGRA_FUNAP_TITULO = 'Regra FUNAP:';
const REGRA_FUNAP_DESCRICAO =
  'A fila prioriza o reeducando mais antigo. Profissão deve ser compatível e o artigo não pode ser vedado.';

function formatTelaoDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('pt-BR');
}

function getFilaStatusPresentation(row: FilaItemTelao): {
  color: 'success' | 'error' | 'warning' | 'default';
  icon: ReactElement;
  label: string;
  tooltip?: string;
} {
  switch (row.status_visual) {
    case 'ELEGIVEL':
      return {
        color: 'success',
        icon: <Iconify icon="solar:check-circle-bold" width={16} />,
        label:
          row.vagas_elegiveis_count != null && row.vagas_elegiveis_count > 0
            ? `Elegível · ${row.vagas_elegiveis_count} vaga${row.vagas_elegiveis_count === 1 ? '' : 's'}`
            : 'Elegível',
      };
    case 'BLOQUEADO':
      return {
        color: 'error',
        icon: <Iconify icon="solar:forbidden-circle-bold" width={16} />,
        label: `Bloqueado · ${row.motivo_resumo}`,
        tooltip: row.motivo_resumo,
      };
    case 'SEM_VAGA':
    default:
      return {
        color: 'warning',
        icon: <Iconify icon="solar:danger-triangle-bold" width={16} />,
        label: 'Sem vaga · nenhuma vaga compatível',
        tooltip: row.motivo_resumo || undefined,
      };
  }
}

export default function TelaoVagasFilaPage() {
  const theme = useTheme();
  const contentShellSx = useMemo(
    () => ({
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      px: theme.spacing(2),
    }),
    [theme]
  );
  const qc = useQueryClient();
  const { hasPermission, isLoading: permMeLoading } = usePermissionCheck();
  const canRead = hasPermission({ action: 'read', subject: 'telao_vagas_fila' });
  const canHist = hasPermission({ action: 'read', subject: 'telao_vagas_fila_historico' });
  const canAlocar = hasPermission({ action: 'create', subject: 'telao_vagas_fila_alocar' });
  const canReservar = hasPermission({ action: 'create', subject: 'telao_vagas_fila_reservar' });
  const canPular = hasPermission({ action: 'create', subject: 'telao_vagas_fila_pular' });

  const [empresaId, setEmpresaId] = useState<string | undefined>(undefined);
  const [detentoId, setDetentoId] = useState<string | undefined>(undefined);
  const [filaPage, setFilaPage] = useState(1);
  const [buscaFila, setBuscaFila] = useState('');
  const [pularOpen, setPularOpen] = useState(false);
  const [justificativa, setJustificativa] = useState('');
  const [vagaExpandida, setVagaExpandida] = useState<string | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['telao-vagas-fila', empresaId, detentoId],
    queryFn: () => api.getTelao({ empresa_id: empresaId, detento_id: detentoId }),
    enabled: canRead,
  });

  const { data: historicoRows = [] } = useQuery({
    queryKey: ['telao-vagas-fila-historico', data?.selecionado?.detento_id, historicoOpen],
    queryFn: () =>
      api.historico({
        ...(data?.selecionado?.detento_id
          ? { detento_id: data.selecionado.detento_id }
          : {}),
        limit: 40,
      }),
    enabled: canHist && historicoOpen,
  });

  const filaFiltrada = useMemo(() => {
    const f = data?.fila ?? [];
    const q = buscaFila.trim().toLowerCase();
    if (!q) return f;
    return f.filter(
      (row) =>
        row.nome.toLowerCase().includes(q) ||
        (row.prontuario ?? '').toLowerCase().includes(q)
    );
  }, [data?.fila, buscaFila]);

  const filaPagina = useMemo(() => {
    const start = (filaPage - 1) * PAGE_SIZE;
    return filaFiltrada.slice(start, start + PAGE_SIZE);
  }, [filaFiltrada, filaPage]);

  const pageCount = Math.max(1, Math.ceil(filaFiltrada.length / PAGE_SIZE));

  const onSelectRow = useCallback((id: string) => {
    setDetentoId(id);
    setFilaPage(1);
  }, []);

  const mutPular = useMutation({
    mutationFn: () =>
      api.pular({
        detento_id: data?.selecionado?.detento_id ?? '',
        justificativa,
      }),
    onSuccess: async () => {
      toast.success('Registro de adiamento salvo');
      setPularOpen(false);
      setJustificativa('');
      await qc.invalidateQueries({ queryKey: ['telao-vagas-fila'] });
    },
    onError: (e: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Falha ao registrar');
    },
  });

  const mutReservar = useMutation({
    mutationFn: (convenio_vaga_id: string) =>
      api.reservar({
        detento_id: data?.selecionado?.detento_id ?? '',
        convenio_vaga_id,
      }),
    onSuccess: async () => {
      toast.success('Reserva criada');
      await qc.invalidateQueries({ queryKey: ['telao-vagas-fila'] });
    },
    onError: (e: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Falha na reserva');
    },
  });

  const mutAlocar = useMutation({
    mutationFn: (convenio_vaga_id: string) =>
      api.alocar({
        detento_id: data?.selecionado?.detento_id ?? '',
        convenio_vaga_id,
      }),
    onSuccess: async () => {
      toast.success('Alocação registrada (contrato ativo)');
      await qc.invalidateQueries({ queryKey: ['telao-vagas-fila'] });
    },
    onError: (e: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Falha na alocação');
    },
  });

  if (permMeLoading) {
    return (
      <DashboardContent maxWidth={false} sx={contentShellSx}>
        <Box sx={{ minHeight: 200 }}>
          <LinearProgress color="primary" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Carregando permissões…
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (!canRead) {
    return (
      <DashboardContent maxWidth={false} sx={contentShellSx}>
        <Typography variant="body2">Sem permissão para o telão de vagas.</Typography>
      </DashboardContent>
    );
  }

  if (isLoading) {
    return (
      <DashboardContent maxWidth={false} sx={contentShellSx}>
        <Box sx={{ minHeight: 200 }}>
          <LinearProgress color="primary" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Carregando telão…
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (isError) {
    return (
      <DashboardContent maxWidth={false} sx={contentShellSx}>
        <Typography color="error" variant="body2">
          {(error as Error)?.message ?? 'Erro ao carregar dados'}
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => refetch()} variant="outlined" color="inherit">
          Tentar novamente
        </Button>
      </DashboardContent>
    );
  }

  if (!data) {
    return null;
  }

  const empresaFiltroNome =
    empresaId != null
      ? data.empresas_com_vagas.find((e) => e.id === empresaId)?.razao_social
      : undefined;
  const vagasPosicoesAbertas = data.vagas.reduce((acc, v) => acc + v.quantidade_disponivel, 0);

  return (
    <DashboardContent maxWidth={false} sx={contentShellSx}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
            TELÃO DE VAGAS — FILA
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {data.titulo} · {new Date().toLocaleString('pt-BR')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          {canHist && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:clock-circle-bold" width={18} />}
              onClick={() => setHistoricoOpen(true)}
            >
              Histórico
            </Button>
          )}
          <Autocomplete
            sx={{ minWidth: 280 }}
            options={data.empresas_com_vagas}
            getOptionLabel={(o) => o.razao_social}
            value={data.empresas_com_vagas.find((e) => e.id === empresaId) ?? null}
            onChange={(_, v) => {
              setEmpresaId(v?.id);
              setDetentoId(undefined);
              setFilaPage(1);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Empresa / contratante"
                placeholder="Todas"
                size="small"
              />
            )}
          />
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 2, flexWrap: 'wrap' }}
        useFlexGap
      >
        {[
          { k: 'VAGAS', v: data.indicadores.total_vagas_linhas, c: theme.palette.text.primary },
          { k: 'ELEGÍVEIS', v: data.indicadores.elegiveis, c: theme.palette.success.main },
          { k: 'ALERTAS', v: data.indicadores.alertas, c: theme.palette.warning.main },
          { k: 'INELEGÍVEIS', v: data.indicadores.inelegiveis, c: theme.palette.error.main },
          { k: 'POSIÇÃO', v: data.indicadores.posicao_destaque, c: theme.palette.text.primary },
        ].map((it) => (
          <Card
            key={it.k}
            variant="outlined"
            sx={{
              p: 2,
              flex: { sm: '1 1 120px' },
              minWidth: { sm: 100 },
              bgcolor: 'background.paper',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1.2, lineHeight: 1.5 }}
            >
              {it.k}
            </Typography>
            <Typography variant="h4" sx={{ color: it.c, fontWeight: 700, lineHeight: 1.2, mt: 0.5 }}>
              {it.v}
            </Typography>
          </Card>
        ))}
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Vagas elegíveis para este reeducando
        </Typography>
        <LinearProgress
          color="success"
          variant="determinate"
          value={
            data.vagas.length
              ? Math.round(
                  (data.vagas.filter((x) => x.elegivel).length / data.vagas.length) * 100
                )
              : 0
          }
          sx={{ mt: 1, height: 6, borderRadius: 1 }}
        />
        <Typography
          variant="caption"
          color="success"
          sx={{ mt: 0.5, display: 'block', fontWeight: 600 }}
        >
          {data.progresso_texto}
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          mb: 2,
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#141a18',
          borderColor: alpha('#5ee9a8', 0.28),
          boxShadow: `inset 0 1px 0 ${alpha('#fff', 0.04)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.75} sx={{ width: 1, minWidth: 0 }}>
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: '#5ee9a8' }}>
            <Iconify icon="custom:flash-outline" width={22} />
          </Box>
          <Typography
            component="p"
            sx={{
              flex: 1,
              minWidth: 0,
              m: 0,
              lineHeight: 1.5,
              letterSpacing: 0.01,
              whiteSpace: 'nowrap',
              fontSize: 'clamp(0.62rem, 0.45vw + 0.58rem, 0.875rem)',
              color: alpha('#e8f4ef', 0.78),
            }}
          >
            <Box component="span" sx={{ fontWeight: 800, color: '#f2faf6' }}>
              {REGRA_FUNAP_TITULO}
            </Box>{' '}
            <Box component="span" sx={{ fontWeight: 400 }}>
              {REGRA_FUNAP_DESCRICAO}
            </Box>
          </Typography>
        </Stack>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Stack spacing={0.25} sx={{ mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
              FILA DE REEDUCANDOS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filaFiltrada.length} na fila · ordenados por antiguidade
            </Typography>
          </Stack>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nome ou matrícula…"
            value={buscaFila}
            onChange={(e) => {
              setBuscaFila(e.target.value);
              setFilaPage(1);
            }}
            sx={{ mb: 1.5 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack spacing={1}>
            {filaPagina.map((row) => {
              const sel = row.detento_id === data.selecionado?.detento_id;
              const st = getFilaStatusPresentation(row);
              const chipEl = (
                <Chip
                  size="small"
                  icon={st.icon}
                  label={st.label}
                  color={st.color}
                  variant={st.color === 'warning' ? 'outlined' : 'soft'}
                  sx={{
                    height: 26,
                    maxWidth: '100%',
                    fontWeight: 600,
                    fontSize: 11,
                    '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis', px: 0.75 },
                  }}
                />
              );
              return (
                <Card
                  key={row.detento_id}
                  variant="outlined"
                  onClick={() => onSelectRow(row.detento_id)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    bgcolor: sel ? alpha(theme.palette.success.main, 0.06) : 'background.paper',
                    borderColor: sel ? alpha(theme.palette.success.main, 0.55) : 'divider',
                    transition: theme.transitions.create(['border-color', 'background-color'], {
                      duration: 150,
                    }),
                    '&:hover': {
                      borderColor: sel ? 'success.main' : 'primary.light',
                      bgcolor: sel
                        ? alpha(theme.palette.success.main, 0.1)
                        : 'action.hover',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <Box
                      sx={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: 1.5,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 13,
                        bgcolor: sel ? alpha(theme.palette.success.main, 0.14) : 'action.hover',
                        color: sel ? 'success.dark' : 'text.secondary',
                        border: `1px solid ${
                          sel ? alpha(theme.palette.success.main, 0.45) : theme.palette.divider
                        }`,
                      }}
                    >
                      #{row.posicao}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
                        {row.nome}
                      </Typography>
                      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} sx={{ mt: 0.35 }}>
                        <Typography variant="caption" color="text.secondary">
                          {row.prontuario ?? '—'}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          ·
                        </Typography>
                        <Iconify icon="solar:clock-circle-bold" width={14} style={{ opacity: 0.7 }} />
                        <Typography variant="caption" color="text.secondary">
                          {row.dias_na_fila}d
                        </Typography>
                      </Stack>
                      <Box sx={{ mt: 1 }}>
                        {st.tooltip ? (
                          <Tooltip title={st.tooltip} placement="top" enterDelay={400}>
                            <Box component="span" sx={{ display: 'inline-block', maxWidth: '100%' }}>
                              {chipEl}
                            </Box>
                          </Tooltip>
                        ) : (
                          chipEl
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={pageCount}
              page={filaPage}
              onChange={(_, p) => setFilaPage(p)}
              size="small"
              color="primary"
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
            DETALHE DO REEDUCANDO
          </Typography>
          {data.selecionado ? (
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.16),
                    border: `2px solid ${theme.palette.success.main}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:user-rounded-bold" width={28} sx={{ color: 'success.main' }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {data.selecionado.nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.selecionado.prontuario ?? '—'}
                  </Typography>
                  <Chip
                    size="small"
                    color="success"
                    variant="soft"
                    icon={<Iconify icon="solar:flag-bold" width={16} />}
                    label={`#${data.selecionado.posicao_fila} na fila`}
                    sx={{ mt: 0.5, fontWeight: 600 }}
                  />
                </Box>
              </Stack>
              <Divider />
              <Stack spacing={1.35} sx={{ mt: 2 }}>
                {(
                  [
                    {
                      k: 'Profissão',
                      v: data.selecionado.profissoes_texto,
                      icon: 'solar:case-minimalistic-bold',
                    },
                    {
                      k: 'Regime',
                      v: data.selecionado.regime,
                      icon: 'solar:shield-check-bold',
                    },
                    {
                      k: 'Unidade',
                      v: data.selecionado.unidade,
                      icon: 'mingcute:location-fill',
                    },
                    {
                      k: 'Escolaridade',
                      v: data.selecionado.escolaridade,
                      icon: 'eva:award-fill',
                    },
                    {
                      k: 'Artigo',
                      v: data.selecionado.artigo_resumo,
                      icon: 'solar:file-text-bold',
                    },
                    {
                      k: 'Tempo na fila',
                      v: `${data.selecionado.dias_na_fila} dias`,
                      icon: 'solar:clock-circle-bold',
                    },
                    {
                      k: 'Cadastro',
                      v: formatTelaoDate(data.selecionado.ficha_cadastro_em),
                      icon: 'solar:calendar-date-bold',
                    },
                  ] as const
                ).map(({ k, v, icon }) => (
                  <Stack key={k} direction="row" spacing={1.25} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'action.hover',
                        color: 'text.secondary',
                      }}
                    >
                      <Iconify icon={icon} width={18} />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {k}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.15 }}>
                        {v}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
              <Typography
                variant="overline"
                sx={{ mt: 2.5, display: 'block', fontWeight: 700, letterSpacing: 1, color: 'text.secondary' }}
              >
                Experiência
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
                {data.selecionado.experiencias_tags.map((t) => (
                  <Chip
                    key={t}
                    size="small"
                    label={t}
                    variant="soft"
                    color="default"
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Stack>
              {canPular && (
                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  variant="outlined"
                  color="warning"
                  startIcon={<Iconify icon="solar:forward-bold" width={18} />}
                  onClick={() => setPularOpen(true)}
                >
                  Pular na fila
                </Button>
              )}
            </Card>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum reeducando selecionado
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1}
            sx={{ mb: 1.25 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                VAGAS DISPONÍVEIS
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {data.vagas.length} {data.vagas.length === 1 ? 'linha' : 'linhas'}
                {empresaFiltroNome ? ` · ${empresaFiltroNome}` : ''}
              </Typography>
            </Box>
            <Chip
              size="small"
              variant="outlined"
              color="default"
              icon={<Iconify icon="solar:bill-list-bold" width={16} />}
              label={`${vagasPosicoesAbertas} posição(ões) abertas`}
              sx={{ fontWeight: 600, flexShrink: 0, maxWidth: { xs: '100%', sm: 200 } }}
            />
          </Stack>
          <Stack spacing={1.5}>
            {data.vagas.map((v) => (
              <Card
                key={v.convenio_vaga_id}
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: theme.vars.customShadows.z1,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      border: `3px solid ${
                        v.elegivel ? theme.palette.success.main : theme.palette.divider
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      bgcolor: v.elegivel ? alpha(theme.palette.success.main, 0.1) : 'action.hover',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: v.elegivel ? 'success.main' : 'text.disabled',
                        lineHeight: 1,
                      }}
                    >
                      {v.score}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
                      {v.titulo_exibicao}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75 }}>
                      <Iconify icon="solar:users-group-rounded-bold" width={16} sx={{ color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.secondary">
                        {v.empresa_nome}
                      </Typography>
                    </Stack>
                    {v.local_resumo ? (
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.35 }}>
                        <Iconify icon="mingcute:location-fill" width={16} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          {v.local_resumo}
                        </Typography>
                      </Stack>
                    ) : null}
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                      <Iconify icon="solar:wad-of-money-bold" width={16} sx={{ color: 'text.disabled' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {v.valor_referencia != null
                          ? `R$ ${v.valor_referencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'Remuneração sob convênio'}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      icon={
                        v.elegivel ? (
                          <Iconify icon="solar:check-circle-bold" width={16} />
                        ) : (
                          <Iconify icon="solar:close-circle-bold" width={16} />
                        )
                      }
                      label={v.elegivel ? 'Elegível' : 'Inelegível'}
                      color={v.elegivel ? 'success' : 'default'}
                      variant={v.elegivel ? 'soft' : 'outlined'}
                      sx={{ mt: 1.25, height: 28, fontWeight: 700 }}
                    />
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      alignItems="center"
                      columnGap={2}
                      rowGap={0.75}
                      sx={{ mt: 1.25 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:bill-list-bold" width={14} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          Total {v.quantidade_total}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:verified-check-bold" width={14} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          Preenchidas {v.quantidade_preenchida}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:inbox-bold" width={14} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          Reservadas {v.quantidade_reservada}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:box-minimalistic-bold" width={14} sx={{ color: 'success.main' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                          Disponíveis {v.quantidade_disponivel}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
                      <Button
                        fullWidth
                        size="medium"
                        variant="contained"
                        color="success"
                        disabled={!canAlocar || !v.elegivel || v.quantidade_disponivel <= 0}
                        startIcon={<Iconify icon="solar:user-plus-bold" width={20} />}
                        onClick={() => mutAlocar.mutate(v.convenio_vaga_id)}
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      >
                        Alocar
                      </Button>
                      <Button
                        fullWidth
                        size="medium"
                        variant="outlined"
                        color="inherit"
                        disabled={!canReservar || !v.elegivel || v.quantidade_disponivel <= 0}
                        startIcon={<Iconify icon="solar:suitcase-tag-bold" width={20} />}
                        onClick={() => mutReservar.mutate(v.convenio_vaga_id)}
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      >
                        Reservar
                      </Button>
                    </Stack>
                    <Button
                      fullWidth
                      size="small"
                      color="inherit"
                      variant="outlined"
                      sx={{
                        mt: 1.5,
                        justifyContent: 'space-between',
                        borderRadius: 1.5,
                        py: 1,
                        px: 1.5,
                        borderColor: 'divider',
                        fontWeight: 600,
                      }}
                      endIcon={
                        <Iconify
                          icon="eva:arrow-ios-downward-fill"
                          width={18}
                          style={{
                            transform:
                              vagaExpandida === v.convenio_vaga_id ? 'rotate(180deg)' : 'none',
                          }}
                        />
                      }
                      onClick={() =>
                        setVagaExpandida((cur) =>
                          cur === v.convenio_vaga_id ? null : v.convenio_vaga_id
                        )
                      }
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:list-bold" width={18} />
                        Critérios do match
                      </Stack>
                    </Button>
                    <Collapse in={vagaExpandida === v.convenio_vaga_id}>
                      <Stack
                        spacing={0.5}
                        sx={{ mt: 1, pl: 1, borderLeft: `2px solid ${theme.palette.divider}` }}
                      >
                        {v.criterios.map((c) => (
                          <Typography
                            key={c.chave}
                            variant="caption"
                            color={c.ok ? 'success.main' : 'error.main'}
                          >
                            {c.ok ? '✓' : '✗'} {c.label}
                            {c.detalhe ? ` — ${c.detalhe}` : ''}
                          </Typography>
                        ))}
                      </Stack>
                    </Collapse>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
          {data.vagas.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhuma vaga no filtro atual.
            </Typography>
          )}
        </Grid>
      </Grid>

      <Dialog open={pularOpen} onClose={() => setPularOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Justificativa obrigatória</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 1 }}
            label="Motivo do adiamento na fila"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            helperText="Mínimo 5 caracteres"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPularOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={justificativa.trim().length < 5 || mutPular.isPending}
            onClick={() => mutPular.mutate()}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={historicoOpen} onClose={() => setHistoricoOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Histórico recente</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1}>
            {historicoRows.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhum evento.
              </Typography>
            )}
            {historicoRows.map((h) => (
              <Card key={h.telao_fila_evento_id} variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(h.created_at).toLocaleString('pt-BR')} · {h.tipo}
                </Typography>
                {h.justificativa && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {h.justificativa}
                  </Typography>
                )}
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={() => setHistoricoOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
