import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';
import type { DetentoStatusFilter } from '../types';

import { useMemo, useCallback } from 'react';

import { Box, Card, Stack, Button, MenuItem, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { MetricCard } from 'src/components/metric-card';
import { CustomDataGrid } from 'src/components/custom-data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionGuard } from 'src/auth/guard';

import { detentoToFormValues } from '../helper';
import { useDetentoList } from '../hooks/use-detento-list';
import { useDetentoListTable } from '../hooks/use-detento-list-table';
import { useDetentoIndicadores } from '../hooks/use-detento-indicadores';
import { useDetentoCadastroStore } from '../stores/detento-cadastro-store';
import { useDetentoSearchParams } from '../hooks/use-detento-search-params';
import { DetentoFormDialog } from '../components/cadastro/detento-form-dialog';
import { DetentoDeleteDialog } from '../components/cadastro/detento-delete-dialog';

const STATUS_OPTIONS: { value: DetentoStatusFilter; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'AGUARDANDO_VALIDACAO', label: 'Aguardando validação' },
  { value: 'VALIDADO', label: 'Aprovado' },
  { value: 'FILA_DISPONIVEL', label: 'Na fila' },
  { value: 'REQUER_CORRECAO', label: 'Requer correção' },
  { value: 'SEM_FICHA', label: 'Sem ficha' },
];

export default function DetentoCadastroPage() {
  const [searchParams, setSearchParams] = useDetentoSearchParams();

  const { selectedDetento, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useDetentoCadastroStore();

  const { data, isLoading } = useDetentoList(searchParams);
  const { data: indicadores, isLoading: indicadoresLoading } = useDetentoIndicadores();

  const { columns } = useDetentoListTable();

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

  const setStatusFilter = (status: DetentoStatusFilter) => {
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

  const statusActive = searchParams.status_validacao;

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de Reeducandos"
        links={[
          { name: 'Carceragem' },
          { name: 'Reeducandos', href: paths.carceragem.reeducandos.root },
        ]}
        action={
          <PermissionGuard
            hasContent={false}
            required={[{ action: 'create', subject: 'detentos' }]}
          >
            <Button
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreateDialog}
            >
              Adicionar
            </Button>
          </PermissionGuard>
        }
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      {/* ---------- KPI cards — clicáveis viram filtro ---------- */}
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
          label="Total"
          value={indicadores?.total}
          icon="solar:users-group-rounded-bold-duotone"
          tone="neutral"
          loading={indicadoresLoading}
          active={statusActive === ''}
          onClick={() => setSearchParams({ status_validacao: '', page: 1 })}
        />
        <MetricCard
          label="Aprovados"
          value={indicadores?.aprovados}
          icon="solar:file-check-bold-duotone"
          tone="success"
          loading={indicadoresLoading}
          active={statusActive === 'VALIDADO'}
          onClick={() => setStatusFilter('VALIDADO')}
        />
        <MetricCard
          label="Aguardando"
          value={indicadores?.aguardando}
          icon="solar:clock-circle-bold"
          tone="warning"
          loading={indicadoresLoading}
          active={statusActive === 'AGUARDANDO_VALIDACAO'}
          onClick={() => setStatusFilter('AGUARDANDO_VALIDACAO')}
        />
        <MetricCard
          label="Requer correção"
          value={indicadores?.requer_correcao}
          icon="solar:file-corrupted-bold-duotone"
          tone="error"
          loading={indicadoresLoading}
          active={statusActive === 'REQUER_CORRECAO'}
          onClick={() => setStatusFilter('REQUER_CORRECAO')}
        />
        <MetricCard
          label="Sem ficha"
          value={indicadores?.sem_ficha}
          icon="solar:file-bold-duotone"
          tone="neutral"
          loading={indicadoresLoading}
          active={statusActive === 'SEM_FICHA'}
          onClick={() => setStatusFilter('SEM_FICHA')}
        />
      </Box>

      {/* ---------- Filtros secundários ---------- */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label="Status da ficha"
            value={searchParams.status_validacao}
            onChange={(e) =>
              setSearchParams({
                status_validacao: e.target.value as DetentoStatusFilter,
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
            label="Motivo da reprovação"
            placeholder="ex.: artigo vedado"
            value={searchParams.motivo_reprovacao}
            onChange={(e) => setSearchParams({ motivo_reprovacao: e.target.value, page: 1 })}
            sx={{ flex: 1, maxWidth: { md: 360 } }}
          />
          <TextField
            size="small"
            label="CPF"
            placeholder="somente dígitos"
            value={searchParams.cpf}
            onChange={(e) => setSearchParams({ cpf: e.target.value, page: 1 })}
            sx={{ minWidth: 180 }}
          />
        </Stack>
      </Card>

      {/* ---------- Tabela ---------- */}
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
        <DetentoFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedDetento && {
            defaultValues: detentoToFormValues(selectedDetento),
            detentoId: selectedDetento.id,
          })}
        />
        <DetentoDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
