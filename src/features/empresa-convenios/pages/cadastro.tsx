import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';

import { Box, Card, Menu, Button, Tooltip, MenuItem, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { MetricCard } from 'src/components/metric-card';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { PermissionGuard } from 'src/auth/guard';

import { useEmpresaConvenioList } from '../hooks/use-empresa-convenio-list';
import { useEmpresaConvenioMetrics } from '../hooks/use-empresa-convenio-metrics';
import { useEmpresaConvenioListTable } from '../hooks/use-empresa-convenio-list-table';
import { useEmpresaConvenioSearchParams } from '../hooks/use-empresa-convenio-search-params';
import { EmpresaConvenioDeleteDialog } from '../components/cadastro/empresa-convenio-delete-dialog';

const VIGENCIA_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'ativa', label: 'Ativa' },
  { value: 'encerrada', label: 'Encerrada' },
];

type VigenciaFilterButtonProps = {
  vigencia: string;
  onChange: (value: string) => void;
};

function VigenciaFilterButton({ vigencia, onChange }: VigenciaFilterButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Tooltip title="Filtrar por vigência">
        <IconButton
          size="small"
          color={vigencia ? 'primary' : 'default'}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Iconify icon="solar:calendar-date-bold" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {VIGENCIA_OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={vigencia === opt.value}
            onClick={() => {
              onChange(opt.value);
              setAnchorEl(null);
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function EmpresaConvenioCadastroPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useEmpresaConvenioSearchParams();

  const { data, isLoading } = useEmpresaConvenioList(searchParams);
  const { data: metrics, isLoading: metricsLoading } = useEmpresaConvenioMetrics();
  const { columns } = useEmpresaConvenioListTable();

  const handlePaginationModelChange = useCallback(
    (newModel: GridPaginationModel) => {
      // Se a página já está no formato 1-based (vem do CustomDataGrid), usar diretamente
      // Se vem do MUI DataGrid (0-based), converter para 1-based
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
      setSearchParams({ search: quick, page: 1 }); // Frontend usa 1-based, está correto
    },
    [setSearchParams]
  );

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Convênios"
        links={[{ name: 'Laboral' }, { name: 'Convênios', href: paths.laboral.convenios.root }]}
        action={
          <PermissionGuard
            hasContent={false}
            required={{ action: 'create', subject: 'empresas_convenio' }}
          >
            <Button
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => navigate(paths.laboral.convenios.new)}
            >
              Adicionar
            </Button>
          </PermissionGuard>
        }
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          mb: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        <MetricCard
          label="Total de convênios"
          value={metrics?.total}
          icon="solar:file-text-bold"
          tone="neutral"
          loading={metricsLoading}
          active={!searchParams.status && !searchParams.modalidade}
          onClick={() => setSearchParams({ status: '', modalidade: '', page: 1 })}
        />
        <MetricCard
          label="Ativos"
          value={metrics?.ativos}
          icon="solar:check-circle-bold"
          tone="success"
          loading={metricsLoading}
          active={searchParams.status === 'ativo'}
          onClick={() =>
            setSearchParams({ status: searchParams.status === 'ativo' ? '' : 'ativo', page: 1 })
          }
        />
        <MetricCard
          label="Intramuros"
          value={metrics?.intramuros}
          icon="solar:home-angle-bold-duotone"
          tone="primary"
          loading={metricsLoading}
          active={searchParams.modalidade === 'INTRAMUROS'}
          onClick={() =>
            setSearchParams({
              modalidade: searchParams.modalidade === 'INTRAMUROS' ? '' : 'INTRAMUROS',
              page: 1,
            })
          }
        />
        <MetricCard
          label="Extramuros"
          value={metrics?.extramuros}
          icon="solar:forward-bold"
          tone="warning"
          loading={metricsLoading}
          active={searchParams.modalidade === 'EXTRAMUROS'}
          onClick={() =>
            setSearchParams({
              modalidade: searchParams.modalidade === 'EXTRAMUROS' ? '' : 'EXTRAMUROS',
              page: 1,
            })
          }
        />
      </Box>

      <Card
        sx={{
          minHeight: 640,
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: '1px' },
          flexDirection: { md: 'column' },
        }}
      >
        <CustomDataGrid
          hasNextPage={data?.hasNextPage || false}
          total={data?.total || 0}
          rows={data?.items || []}
          columns={columns}
          loading={isLoading}
          page={searchParams.page}
          limit={searchParams.limit}
          sort={searchParams.sort}
          order={searchParams.order}
          search={searchParams.search}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={handleFilterModelChange}
          getRowId={(row: any) => row.id}
          slotProps={{
            toolbar: {
              additionalItems: (
                <VigenciaFilterButton
                  vigencia={searchParams.vigencia}
                  onChange={(v) => setSearchParams({ vigencia: v, page: 1 })}
                />
              ),
            } as any,
          }}
        />

        <EmpresaConvenioDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
