import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';
import type { StatusValidacaoFicha } from '../types';

import { useMemo, useState, useCallback } from 'react';

import { Box, Card, Alert, Stack, Button, MenuItem, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { MetricCard } from 'src/components/metric-card';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { useFichasCadastraisList } from '../hooks/use-fichas-cadastrais-list';
import { AddFichaCadastralDialog } from '../components/add-ficha-cadastral-dialog';
import { useFichasCadastraisMetrics } from '../hooks/use-fichas-cadastrais-metrics';
import { useFichasCadastraisListTable } from '../hooks/use-fichas-cadastrais-list-table';
import { useFichasCadastraisSearchParams } from '../hooks/use-fichas-cadastrais-search-params';

const STATUS_OPTIONS: { value: StatusValidacaoFicha | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'AGUARDANDO_VALIDACAO', label: 'Pendente' },
  { value: 'VALIDADO', label: 'Aprovado' },
  { value: 'REQUER_CORRECAO', label: 'Requer correção' },
  { value: 'FILA_DISPONIVEL', label: 'Na fila' },
];

export default function FichasCadastraisListPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [cpfInput, setCpfInput] = useState('');
  const [searchParams, setSearchParams] = useFichasCadastraisSearchParams();

  const { data, isLoading } = useFichasCadastraisList(searchParams);
  const { data: metrics, isLoading: metricsLoading } = useFichasCadastraisMetrics();

  const { columns } = useFichasCadastraisListTable();

  const handlePaginationModelChange = useCallback(
    (newModel: GridPaginationModel) => {
      const frontendPage = newModel.page >= 1 ? newModel.page : newModel.page + 1;
      setSearchParams({ page: frontendPage, limit: newModel.pageSize });
    },
    [setSearchParams]
  );

  const handleSortModelChange = useCallback(
    (newModel: GridSortModel) => {
      setSearchParams({ sort: newModel[0]?.field || '', order: newModel[0]?.sort || 'asc' });
    },
    [setSearchParams]
  );

  const handleFilterModelChange = useCallback(
    (model: GridFilterModel) => {
      const quick = Array.isArray(model.quickFilterValues) ? model.quickFilterValues.join(' ') : '';
      setSearchParams({ search: quick, page: 1 });
    },
    [setSearchParams]
  );

  const setStatusFilter = (status: StatusValidacaoFicha) => {
    setSearchParams({
      status_validacao: searchParams.status_validacao === status ? '' : status,
      page: 1,
    });
  };

  const dataGridProps = useMemo(
    () => ({
      hasNextPage: data?.hasNextPage || false,
      total: data?.total || 0,
      rows: data?.items || [],
      columns,
      loading: isLoading,
      page: searchParams.page,
      limit: searchParams.limit,
      sort: searchParams.sort,
      order: searchParams.order,
      search: searchParams.search,
      onPaginationModelChange: handlePaginationModelChange,
      onSortModelChange: handleSortModelChange,
      onFilterModelChange: handleFilterModelChange,
      getRowId: (row: any) => row.id,
    }),
    [
      data?.hasNextPage,
      data?.total,
      data?.items,
      columns,
      isLoading,
      searchParams.page,
      searchParams.limit,
      searchParams.sort,
      searchParams.order,
      searchParams.search,
      handlePaginationModelChange,
      handleSortModelChange,
      handleFilterModelChange,
    ]
  );

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Fichas Cadastrais"
        links={[
          { name: 'Laboral' },
          { name: 'Fichas Cadastrais', href: paths.laboral.fichasCadastrais.root },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setAddDialogOpen(true)}
          >
            Adicionar
          </Button>
        }
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        Esta tela lista e gerencia apenas fichas cadastrais ativas. Para visualizar o histórico de
        fichas de um reeducando, acesse os detalhes do reeducando.
      </Alert>

      {/* ---------- KPI cards ---------- */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          mb: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
          },
        }}
      >
        <MetricCard
          label="Fichas ativas"
          value={metrics?.ativas}
          icon="solar:file-bold-duotone"
          tone="neutral"
          loading={metricsLoading}
          active={searchParams.status_validacao === ''}
          onClick={() => setSearchParams({ status_validacao: '', page: 1 })}
        />
        <MetricCard
          label="Aprovadas"
          value={metrics?.aprovadas}
          icon="solar:file-check-bold-duotone"
          tone="success"
          loading={metricsLoading}
          active={searchParams.status_validacao === 'VALIDADO'}
          onClick={() => setStatusFilter('VALIDADO')}
        />
        <MetricCard
          label="Alertas"
          value={metrics?.alertas}
          icon="solar:shield-keyhole-bold-duotone"
          tone="warning"
          loading={metricsLoading}
        />
        <MetricCard
          label="Reprovadas"
          value={metrics?.reprovadas}
          icon="solar:file-corrupted-bold-duotone"
          tone="error"
          loading={metricsLoading}
          active={searchParams.status_validacao === 'REQUER_CORRECAO'}
          onClick={() => setStatusFilter('REQUER_CORRECAO')}
        />
        <MetricCard
          label="Pendentes"
          value={metrics?.pendentes}
          icon="solar:clock-circle-bold"
          tone="warning"
          loading={metricsLoading}
          active={searchParams.status_validacao === 'AGUARDANDO_VALIDACAO'}
          onClick={() => setStatusFilter('AGUARDANDO_VALIDACAO')}
        />
      </Box>

      {/* ---------- Secondary filters ---------- */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label="Status de validação"
            value={searchParams.status_validacao}
            onChange={(e) =>
              setSearchParams({
                status_validacao: e.target.value as StatusValidacaoFicha | '',
                page: 1,
              })
            }
            sx={{ minWidth: 220 }}
          >
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o.value || 'all'} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="CPF"
            placeholder="somente dígitos"
            value={cpfInput}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              setCpfInput(digits);
              setSearchParams({ cpf: digits.length >= 3 ? digits : '', page: 1 });
            }}
            inputProps={{ maxLength: 11, inputMode: 'numeric' }}
            sx={{ minWidth: 180 }}
          />
        </Stack>
      </Card>

      <AddFichaCadastralDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />

      {/* ---------- Table ---------- */}
      <Card
        sx={{
          minHeight: 520,
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: '1px' },
          flexDirection: { md: 'column' },
        }}
      >
        <CustomDataGrid {...dataGridProps} />
      </Card>
    </DashboardContent>
  );
}
