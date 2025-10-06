import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { useMemo, useCallback } from 'react';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomDataGrid } from 'src/components/custom-data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionGuard } from 'src/auth/guard';

import { unidadePrisionalToFormValues } from '../helper';
import { useUnidadePrisionalList } from '../hooks/use-unidade-prisional-list';
import { useUnidadePrisionalListTable } from '../hooks/use-unidade-prisional-list-table';
import { useUnidadePrisionalCadastroStore } from '../stores/unidade-prisional-cadastro-store';
import { useUnidadePrisionalSearchParams } from '../hooks/use-unidade-prisional-search-params';
import { UnidadePrisionalFormDialog } from '../components/cadastro/unidade-prisional-form-dialog';
import { UnidadePrisionalDeleteDialog } from '../components/cadastro/unidade-prisional-delete-dialog';

export default function UnidadePrisionalCadastroPage() {
  const [searchParams, setSearchParams] = useUnidadePrisionalSearchParams();

  const { selectedUnidadePrisional, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useUnidadePrisionalCadastroStore();

  const { data, isLoading } = useUnidadePrisionalList(searchParams);

  const { columns } = useUnidadePrisionalListTable();

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
        heading="Cadastro de Unidades Prisionais"
        links={[
          { name: 'Unidades Prisionais' },
          { name: 'Cadastro de Unidades Prisionais', href: paths.unidadesPrisionais.root },
        ]}
        action={
          <PermissionGuard
            hasContent={false}
            required={{ action: 'create', subject: 'unidades_prisionais' }}
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

        <UnidadePrisionalFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedUnidadePrisional && {
            defaultValues: unidadePrisionalToFormValues(selectedUnidadePrisional),
            unidadeId: selectedUnidadePrisional.id,
          })}
        />

        <UnidadePrisionalDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
