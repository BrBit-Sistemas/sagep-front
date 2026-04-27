import type { FilaItemTelao } from 'src/api/telao-vagas-fila/telao-vagas-fila';

import { useMemo, useState, useCallback, type ReactElement } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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

function formatTelaoDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('pt-BR');
}

function formatTempoFila(tempo: { dias: number; horas: number; minutos: number }, compact = false): string {
  const { dias, horas, minutos } = tempo;
  if (compact) return `${dias}d ${horas}h`;
  const parts: string[] = [`${dias} ${dias === 1 ? 'dia' : 'dias'}`, `${horas}h`];
  if (minutos > 0) parts.push(`${minutos}min`);
  return parts.join(' ');
}

function getFilaStatusPresentation(row: FilaItemTelao): {
  color: 'success' | 'error' | 'warning' | 'default';
  icon: ReactElement;
  label: string;
  detail?: string;
  tooltip?: string;
} {
  switch (row.status_visual) {
    case 'ELEGIVEL':
      return {
        color: 'success',
        icon: <Iconify icon="solar:check-circle-bold" width={14} />,
        label: 'Elegível',
        detail:
          row.vagas_elegiveis_count != null && row.vagas_elegiveis_count > 0
            ? `${row.vagas_elegiveis_count} vaga${row.vagas_elegiveis_count === 1 ? '' : 's'}`
            : undefined,
      };
    case 'BLOQUEADO':
      return {
        color: 'error',
        icon: <Iconify icon="solar:forbidden-circle-bold" width={14} />,
        label: 'Bloqueado',
        detail: row.motivo_resumo,
        tooltip: row.motivo_resumo,
      };
    case 'SEM_VAGA':
    default:
      return {
        color: 'warning',
        icon: <Iconify icon="solar:danger-triangle-bold" width={14} />,
        label: 'Sem vaga',
        detail: 'nenhuma vaga compatível',
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
      flexDirection: 'column' as const,
      px: theme.spacing(2),
      pb: `${theme.spacing(2)} !important`,
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
        ...(data?.selecionado?.detento_id ? { detento_id: data.selecionado.detento_id } : {}),
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
        row.nome.toLowerCase().includes(q) || (row.prontuario ?? '').toLowerCase().includes(q)
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
      api.pular({ detento_id: data?.selecionado?.detento_id ?? '', justificativa }),
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
      api.reservar({ detento_id: data?.selecionado?.detento_id ?? '', convenio_vaga_id }),
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
      api.alocar({ detento_id: data?.selecionado?.detento_id ?? '', convenio_vaga_id }),
    onSuccess: async () => {
      toast.success('Alocação registrada (contrato ativo)');
      await qc.invalidateQueries({ queryKey: ['telao-vagas-fila'] });
    },
    onError: (e: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Falha na alocação');
    },
  });

  // ─── Loading / error / guard states ───────────────────────────────────────

  const shellContent = (children: ReactElement) => (
    <DashboardContent maxWidth={false} sx={contentShellSx}>
      {children}
    </DashboardContent>
  );

  if (permMeLoading) {
    return shellContent(
      <Box sx={{ minHeight: 200 }}>
        <LinearProgress color="primary" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Carregando permissões…
        </Typography>
      </Box>
    );
  }

  if (!canRead) {
    return shellContent(
      <Typography variant="body2">Sem permissão para o telão de vagas.</Typography>
    );
  }

  if (isLoading) {
    return shellContent(
      <Box sx={{ minHeight: 200 }}>
        <LinearProgress color="primary" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Carregando telão…
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return shellContent(
      <Box>
        <Typography color="error" variant="body2">
          {(error as Error)?.message ?? 'Erro ao carregar dados'}
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => refetch()} variant="outlined" color="inherit">
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (!data) return null;

  // ─── Derived ──────────────────────────────────────────────────────────────

  const empresaFiltroNome =
    empresaId != null
      ? data.empresas_com_vagas.find((e) => e.id === empresaId)?.razao_social
      : undefined;
  const vagasPosicoesAbertas = data.vagas.reduce((acc, v) => acc + v.quantidade_disponivel, 0);
  const vagasElegiveis = data.vagas.filter((x) => x.elegivel).length;
  const progressoPct = data.vagas.length
    ? Math.round((vagasElegiveis / data.vagas.length) * 100)
    : 0;

  // Column panel style — subtle background, rounded, no border
  const colSx = {
    display: 'flex',
    flexDirection: 'column' as const,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[800], 0.35)
        : alpha(theme.palette.grey[200], 0.6),
    overflow: 'hidden',
    minHeight: 0,
  };

  const colHeaderSx = {
    px: 2,
    pt: 2,
    pb: 1.5,
    flexShrink: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  const colBodySx = {
    flex: 1,
    overflowY: 'auto' as const,
    px: 1.5,
    py: 1.5,
    minHeight: 0,
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <DashboardContent maxWidth={false} sx={contentShellSx}>

      {/* ── Header: título + data + empresa filter + histórico ── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2.5, flexShrink: 0 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
            Telão de Vagas — Fila
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.25 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Iconify icon="solar:calendar-date-bold" width={14} sx={{ color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Iconify icon="solar:clock-circle-bold" width={14} sx={{ color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {canHist && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:clock-circle-bold" width={16} />}
              onClick={() => setHistoricoOpen(true)}
            >
              Histórico
            </Button>
          )}
          <Autocomplete
            sx={{ minWidth: 260 }}
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
                placeholder="Todas as empresas"
                size="small"
              />
            )}
          />
        </Stack>
      </Stack>

      {/* ── Indicadores ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 2, flexShrink: 0 }}
        useFlexGap
      >
        {[
          {
            k: 'VAGAS',
            v: data.indicadores.total_vagas_linhas,
            icon: 'solar:users-group-rounded-bold',
            c: theme.palette.text.primary,
          },
          {
            k: 'ELEGÍVEIS',
            v: data.indicadores.elegiveis,
            icon: 'solar:check-circle-bold',
            c: theme.palette.success.main,
          },
          {
            k: 'ALERTAS',
            v: data.indicadores.alertas,
            icon: 'solar:danger-triangle-bold',
            c: theme.palette.warning.main,
          },
          {
            k: 'INELEGÍVEIS',
            v: data.indicadores.inelegiveis,
            icon: 'solar:close-circle-bold',
            c: theme.palette.error.main,
          },
          {
            k: 'POSIÇÃO',
            v: data.indicadores.posicao_destaque,
            icon: 'solar:hashtag-bold',
            c: theme.palette.info.main,
          },
        ].map((it) => (
          <Card
            key={it.k}
            variant="outlined"
            sx={{
              px: 2.5,
              py: 1.75,
              flex: { sm: '1 1 0' },
              bgcolor: 'background.paper',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(it.c, 0.12),
                  color: it.c,
                  flexShrink: 0,
                }}
              >
                <Iconify icon={it.icon as any} width={22} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: it.c, fontWeight: 700, lineHeight: 1 }}>
                  {it.v}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1, lineHeight: 1.4 }}
                >
                  {it.k}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* ── Barra de progresso ── */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary">
            Vagas elegíveis para este reeducando
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>
            {data.progresso_texto}
          </Typography>
        </Stack>
        <LinearProgress
          color="success"
          variant="determinate"
          value={progressoPct}
          sx={{ height: 6, borderRadius: 1 }}
        />
      </Box>

      {/* ── Regra FUNAP ── */}
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          px: 2.5,
          py: 1.5,
          flexShrink: 0,
          borderRadius: 1.5,
          bgcolor: '#0d1f18',
          borderColor: alpha('#5ee9a8', 0.25),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <Iconify icon="custom:flash-outline" width={20} sx={{ color: '#5ee9a8', flexShrink: 0 }} />
          <Typography
            component="p"
            sx={{
              m: 0,
              fontSize: 'clamp(0.65rem, 0.6vw + 0.5rem, 0.875rem)',
              color: alpha('#e8f4ef', 0.75),
              lineHeight: 1.5,
            }}
          >
            {(() => {
              const sep = data.regra_funap_texto.indexOf(':');
              if (sep === -1) return data.regra_funap_texto;
              return (
                <>
                  <Box component="span" sx={{ fontWeight: 800, color: '#f2faf6' }}>
                    {data.regra_funap_texto.slice(0, sep + 1)}
                  </Box>
                  {data.regra_funap_texto.slice(sep + 1)}
                </>
              );
            })()}
          </Typography>
        </Stack>
      </Card>

      {/* ── Três colunas kanban ── */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 2, alignItems: 'stretch' }}>

        {/* ══ COLUNA 1 — FILA ══ */}
        <Box sx={{ ...colSx, width: 280, flexShrink: 0 }}>
          <Box sx={colHeaderSx}>
            <Typography
              variant="overline"
              sx={{ fontWeight: 800, letterSpacing: 1.2, lineHeight: 1, display: 'block' }}
            >
              Fila de Reeducandos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filaFiltrada.length} na fila · ordenados por antiguidade
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nome ou matrícula…"
              value={buscaFila}
              onChange={(e) => {
                setBuscaFila(e.target.value);
                setFilaPage(1);
              }}
              sx={{ mt: 1.25 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={colBodySx}>
            <Stack spacing={0.75}>
              {filaPagina.map((row) => {
                const sel = row.detento_id === data.selecionado?.detento_id;
                const st = getFilaStatusPresentation(row);
                return (
                  <Card
                    key={row.detento_id}
                    variant="outlined"
                    onClick={() => onSelectRow(row.detento_id)}
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      bgcolor: sel
                        ? alpha(theme.palette.success.main, 0.08)
                        : 'background.paper',
                      borderColor: sel
                        ? alpha(theme.palette.success.main, 0.5)
                        : theme.palette.divider,
                      transition: theme.transitions.create(['border-color', 'background-color'], {
                        duration: 150,
                      }),
                      '&:hover': {
                        borderColor: sel ? 'success.main' : 'primary.light',
                        bgcolor: sel ? alpha(theme.palette.success.main, 0.12) : 'action.hover',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={0} alignItems="flex-start">
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={0.75} alignItems="baseline">
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              color: sel ? 'success.main' : 'text.disabled',
                              fontSize: 11,
                              flexShrink: 0,
                            }}
                          >
                            #{row.posicao}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: 13 }}
                            noWrap
                          >
                            {row.nome}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 0.25 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                            {row.prontuario ?? '—'}
                          </Typography>
                          <Iconify
                            icon="solar:clock-circle-bold"
                            width={11}
                            style={{ opacity: 0.5, flexShrink: 0 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                            {formatTempoFila(row.dias_na_fila, true)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                          <Box sx={{ color: `${st.color}.main`, display: 'flex', alignItems: 'center' }}>
                            {st.icon}
                          </Box>
                          {st.tooltip ? (
                            <Tooltip title={st.tooltip} placement="top" enterDelay={400}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: 11,
                                  color: `${st.color}.main`,
                                  cursor: 'default',
                                }}
                                noWrap
                              >
                                {st.label}
                                {st.detail ? ` · ${st.detail}` : ''}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: 11, color: `${st.color}.main` }}
                              noWrap
                            >
                              {st.label}
                              {st.detail ? (
                                <Box
                                  component="span"
                                  sx={{ fontWeight: 400, color: 'text.secondary' }}
                                >
                                  {' '}
                                  · {st.detail}
                                </Box>
                              ) : null}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 1,
              flexShrink: 0,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Pagination
              count={pageCount}
              page={filaPage}
              onChange={(_, p) => setFilaPage(p)}
              size="small"
              color="primary"
            />
          </Box>
        </Box>

        {/* ══ COLUNA 2 — DETALHE ══ */}
        <Box sx={{ ...colSx, flex: 1 }}>
          <Box sx={colHeaderSx}>
            <Typography
              variant="overline"
              sx={{ fontWeight: 800, letterSpacing: 1.2, lineHeight: 1, display: 'block' }}
            >
              Detalhe do Reeducando
            </Typography>
            {data.selecionado ? (
              <Typography variant="caption" color="text.secondary">
                {data.selecionado.prontuario ?? '—'}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.disabled">
                Selecione um reeducando
              </Typography>
            )}
          </Box>

          <Box sx={colBodySx}>
            {data.selecionado ? (
              <Stack spacing={0}>
                {/* Avatar + nome + posição */}
                <Stack alignItems="center" spacing={1} sx={{ py: 2.5 }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.success.main, 0.14),
                      border: `2px solid ${theme.palette.success.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify
                      icon="solar:user-rounded-bold"
                      width={34}
                      sx={{ color: 'success.main' }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                      {data.selecionado.nome}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {data.selecionado.prontuario ?? '—'}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    color="success"
                    variant="soft"
                    icon={<Iconify icon="solar:flag-bold" width={13} />}
                    label={`#${data.selecionado.posicao_fila} na fila`}
                    sx={{ fontWeight: 700, fontSize: 11 }}
                  />
                </Stack>

                <Divider />

                {/* Info rows */}
                <Stack spacing={0} sx={{ mt: 1 }}>
                  {(
                    [
                      {
                        k: 'Profissão',
                        v: data.selecionado.profissoes_texto,
                        icon: 'solar:case-minimalistic-bold',
                      },
                      { k: 'Regime', v: data.selecionado.regime, icon: 'solar:shield-check-bold' },
                      { k: 'Unidade', v: data.selecionado.unidade, icon: 'mingcute:location-fill' },
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
                        v: formatTempoFila(data.selecionado.dias_na_fila),
                        icon: 'solar:clock-circle-bold',
                      },
                      {
                        k: 'Cadastro',
                        v: formatTelaoDate(data.selecionado.ficha_cadastro_em),
                        icon: 'solar:calendar-date-bold',
                      },
                    ] as const
                  ).map(({ k, v, icon }) => (
                    <Stack
                      key={k}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{
                        py: 1,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        sx={{ width: 120, flexShrink: 0, mt: 0.1 }}
                      >
                        <Iconify
                          icon={icon}
                          width={15}
                          sx={{ color: 'text.disabled', flexShrink: 0 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {k}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                        {v}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                {/* Experiências */}
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: 'text.secondary',
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    Experiência
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {data.selecionado.experiencias_tags.length > 0 ? (
                      data.selecionado.experiencias_tags.map((t) => (
                        <Chip
                          key={t}
                          size="small"
                          label={t}
                          variant="soft"
                          color="default"
                          sx={{ fontWeight: 600 }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                        Nenhuma experiência registrada
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {canPular && (
                  <Button
                    fullWidth
                    sx={{ mt: 3 }}
                    variant="outlined"
                    color="warning"
                    startIcon={<Iconify icon="solar:forward-bold" width={18} />}
                    onClick={() => setPularOpen(true)}
                  >
                    Pular na fila
                  </Button>
                )}
              </Stack>
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: '100%', opacity: 0.4 }}
              >
                <Iconify
                  icon="solar:user-rounded-bold"
                  width={52}
                  sx={{ color: 'text.disabled', mb: 1.5 }}
                />
                <Typography variant="body2" color="text.disabled" textAlign="center">
                  Selecione um reeducando
                  <br />
                  na fila ao lado
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>

        {/* ══ COLUNA 3 — VAGAS ══ */}
        <Box sx={{ ...colSx, width: 420, flexShrink: 0 }}>
          <Box sx={colHeaderSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 800, letterSpacing: 1.2, lineHeight: 1, display: 'block' }}
                >
                  Vagas Disponíveis
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {data.vagas.length} {data.vagas.length === 1 ? 'vaga' : 'vagas'}
                  {empresaFiltroNome ? ` · ${empresaFiltroNome}` : ''}
                </Typography>
              </Box>
              <Chip
                size="small"
                variant="outlined"
                color="default"
                label={`${vagasPosicoesAbertas} ${vagasPosicoesAbertas === 1 ? 'posição aberta' : 'posições abertas'}`}
                sx={{ fontWeight: 600, flexShrink: 0 }}
              />
            </Stack>
          </Box>

          <Box sx={colBodySx}>
            {data.vagas.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: '100%', opacity: 0.4 }}
              >
                <Iconify
                  icon="solar:bill-list-bold"
                  width={48}
                  sx={{ color: 'text.disabled', mb: 1.5 }}
                />
                <Typography variant="body2" color="text.disabled" textAlign="center">
                  Nenhuma vaga no filtro atual
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={1.5}>
                {data.vagas.map((v) => (
                  <Card
                    key={v.convenio_vaga_id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderColor: v.elegivel
                        ? alpha(theme.palette.success.main, 0.3)
                        : theme.palette.divider,
                      borderRadius: 2,
                    }}
                  >
                    {/* Score + título + toggle */}
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          border: `3px solid ${v.elegivel ? theme.palette.success.main : theme.palette.divider}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          bgcolor: v.elegivel
                            ? alpha(theme.palette.success.main, 0.08)
                            : 'action.hover',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
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
                        <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {v.titulo_exibicao}
                          </Typography>
                          {v.nivel && (
                            <Chip
                              size="small"
                              label={v.nivel}
                              variant="outlined"
                              sx={{ height: 18, fontSize: 10, fontWeight: 700, px: 0.25 }}
                            />
                          )}
                        </Stack>

                        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1} sx={{ mt: 0.4 }}>
                          <Stack direction="row" alignItems="center" spacing={0.4}>
                            <Iconify
                              icon="solar:users-group-rounded-bold"
                              width={13}
                              sx={{ color: 'text.disabled' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {v.empresa_nome}
                            </Typography>
                          </Stack>
                          {v.local_resumo && (
                            <Stack direction="row" alignItems="center" spacing={0.4}>
                              <Iconify
                                icon="mingcute:location-fill"
                                width={13}
                                sx={{ color: 'text.disabled' }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {v.local_resumo}
                              </Typography>
                            </Stack>
                          )}
                          {v.valor_referencia != null && (
                            <Stack direction="row" alignItems="center" spacing={0.4}>
                              <Iconify
                                icon="solar:wad-of-money-bold"
                                width={13}
                                sx={{ color: 'text.disabled' }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                R${' '}
                                {v.valor_referencia.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                })}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>

                        {/* Elegível */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                          <Box sx={{ color: v.elegivel ? 'success.main' : 'text.disabled', display: 'flex' }}>
                            <Iconify
                              icon={v.elegivel ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                              width={15}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: v.elegivel ? 'success.main' : 'text.disabled',
                            }}
                          >
                            {v.elegivel ? 'Elegível' : 'Inelegível'}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Toggle critérios */}
                      <Box
                        component="button"
                        onClick={() =>
                          setVagaExpandida((cur) =>
                            cur === v.convenio_vaga_id ? null : v.convenio_vaga_id
                          )
                        }
                        sx={{
                          flexShrink: 0,
                          width: 26,
                          height: 26,
                          borderRadius: 1,
                          border: `1px solid ${theme.palette.divider}`,
                          bgcolor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'text.secondary',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Iconify
                          icon="eva:arrow-ios-downward-fill"
                          width={15}
                          style={{
                            transform:
                              vagaExpandida === v.convenio_vaga_id ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Contagens */}
                    <Stack direction="row" alignItems="center" gap={2} sx={{ mt: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:bill-list-bold" width={13} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          Total:{' '}
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {v.quantidade_total}
                          </Box>
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify
                          icon="solar:verified-check-bold"
                          width={13}
                          sx={{ color: 'text.disabled' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Preenchidas:{' '}
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {v.quantidade_preenchida}
                          </Box>
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify
                          icon="solar:box-minimalistic-bold"
                          width={13}
                          sx={{ color: 'success.main' }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>
                          Disponíveis: {v.quantidade_disponivel}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Botões */}
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={!canAlocar || !v.elegivel || v.quantidade_disponivel <= 0}
                        startIcon={<Iconify icon="solar:user-plus-bold" width={15} />}
                        onClick={() => mutAlocar.mutate(v.convenio_vaga_id)}
                        sx={{ fontWeight: 700, borderRadius: 1.5, flex: 1 }}
                      >
                        Alocar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        disabled={!canReservar || !v.elegivel || v.quantidade_disponivel <= 0}
                        startIcon={<Iconify icon="solar:suitcase-tag-bold" width={15} />}
                        onClick={() => mutReservar.mutate(v.convenio_vaga_id)}
                        sx={{ fontWeight: 700, borderRadius: 1.5, flex: 1 }}
                      >
                        Reservar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        disabled={!canPular || !data.selecionado}
                        startIcon={<Iconify icon="solar:forward-bold" width={15} />}
                        onClick={() => setPularOpen(true)}
                        sx={{ fontWeight: 700, borderRadius: 1.5, flex: 1 }}
                      >
                        Pular
                      </Button>
                    </Stack>

                    {/* Critérios expandidos */}
                    <Collapse in={vagaExpandida === v.convenio_vaga_id}>
                      <Stack
                        spacing={0.5}
                        sx={{
                          mt: 1.5,
                          pl: 1.25,
                          borderLeft: `2px solid ${theme.palette.divider}`,
                        }}
                      >
                        {v.criterios.map((c) => (
                          <Typography
                            key={c.chave}
                            variant="caption"
                            color={c.ok ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 500 }}
                          >
                            {c.ok ? '✓' : '✗'} {c.label}
                            {c.detalhe ? ` — ${c.detalhe}` : ''}
                          </Typography>
                        ))}
                      </Stack>
                    </Collapse>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      {/* ─── Dialog: Pular ─── */}
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

      {/* ─── Dialog: Histórico ─── */}
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
