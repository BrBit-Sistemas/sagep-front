import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { useMemo, useCallback } from 'react';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { PermissionGuard } from 'src/auth/guard';

import { empresaToFormValues } from '../helper';
import { useEmpresaList } from '../hooks/use-empresa-list';
import { useEmpresaListTable } from '../hooks/use-empresa-list-table';
import { useEmpresaCadastroStore } from '../stores/empresa-cadastro-store';
import { useEmpresaSearchParams } from '../hooks/use-empresa-search-params';
import { EmpresaFormDialog } from '../components/cadastro/empresa-form-dialog';
import { EmpresaDeleteDialog } from '../components/cadastro/empresa-delete-dialog';

export default function EmpresaCadastroPage() {
  const [searchParams, setSearchParams] = useEmpresaSearchParams();

  const { selectedEmpresa, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useEmpresaCadastroStore();

  const { data, isLoading } = useEmpresaList(searchParams);

  const { columns } = useEmpresaListTable();

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

  // Memoizar as props para evitar re-renderizações desnecessárias
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
        heading="Cadastro de Empresas"
        links={[{ name: 'Empresas' }, { name: 'Cadastro de Empresas', href: paths.empresas.root }]}
        action={
          <PermissionGuard hasContent={false} required={{ action: 'create', subject: 'empresas' }}>
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
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card
        sx={{
          minHeight: 640,
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: '1px' },
          flexDirection: { md: 'column' },
        }}
      >
        <CustomDataGrid {...dataGridProps} />

        <EmpresaFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedEmpresa && {
            defaultValues: empresaToFormValues(selectedEmpresa),
            empresaId: selectedEmpresa.empresa_id,
          })}
        />

        <EmpresaDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
