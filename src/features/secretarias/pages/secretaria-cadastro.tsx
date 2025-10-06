import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { useMemo, useCallback } from 'react';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { secretariaToFormValues } from 'src/features/secretarias/helper';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { PermissionGuard } from 'src/auth/guard';

import { useSecretariaCadastroStore } from '../stores';
import { useListSecretarias } from '../hooks/use-list-secretaria';
import { useSecretariaListTable } from '../hooks/use-secretaria-list-table';
import { SecretariaFormDialog } from '../components/secretaria-form-dialog';
import { SecretariaDeleteDialog } from '../components/secretaria-delete-dialog';
import { useSecretariaSearchParams } from '../hooks/use-secretaria-search-params';

export default function SecretariaCadastroPage() {
  const [searchParams, setSearchParams] = useSecretariaSearchParams();

  const { selectedSecretaria, isFormDialogOpen, openCreateDialog, closeFormDialog } =
    useSecretariaCadastroStore();

  const { data, isLoading } = useListSecretarias(searchParams);

  const { columns } = useSecretariaListTable();

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSearchParams({ sort: newModel[0]?.field || '', order: newModel[0]?.sort || 'asc' });
  };

  const handleFilterModelChange = useCallback((model: GridFilterModel) => {
    const quick = Array.isArray(model.quickFilterValues) ? model.quickFilterValues.join(' ') : '';
    setSearchParams({ search: quick, page: 1 });
  }, [setSearchParams]);

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
        heading="Cadastro de Secretarias"
        links={[
          { name: 'Secretarias' },
          { name: 'Cadastro de Secretarias', href: paths.secretarias.root },
        ]}
        action={
          <PermissionGuard
            hasContent={false}
            required={{ action: 'create', subject: 'secretarias' }}
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

        <SecretariaFormDialog
          open={isFormDialogOpen}
          onSuccess={closeFormDialog}
          onClose={closeFormDialog}
          {...(selectedSecretaria && {
            defaultValues: secretariaToFormValues(selectedSecretaria),
            secretariaId: selectedSecretaria.id,
          })}
        />

        <SecretariaDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
