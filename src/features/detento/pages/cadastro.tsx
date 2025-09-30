import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { PermissionGuard } from 'src/auth/guard';

import { detentoToFormValues } from '../helper';
import { useDetentoList } from '../hooks/use-detento-list';
import { useDetentoListTable } from '../hooks/use-detento-list-table';
import { useDetentoCadastroStore } from '../stores/detento-cadastro-store';
import { useDetentoSearchParams } from '../hooks/use-detento-search-params';
import { DetentoFormDialog } from '../components/cadastro/detento-form-dialog';
import { DetentoDeleteDialog } from '../components/cadastro/detento-delete-dialog';

export default function DetentoCadastroPage() {
  const [searchParams, setSearchParams] = useDetentoSearchParams();

  const { selectedDetento, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useDetentoCadastroStore();

  const { data, isLoading } = useDetentoList(searchParams);

  const { columns } = useDetentoListTable();

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSearchParams({ sort: newModel[0]?.field || '', order: newModel[0]?.sort || 'asc' });
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    const quick = Array.isArray(model.quickFilterValues) ? model.quickFilterValues.join(' ') : '';
    setSearchParams({ search: quick, page: 1 });
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de Reeducandos"
        links={[
          { name: 'Reeducandos' },
          { name: 'Cadastro de Reeducandos', href: paths.detentos.root },
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
        <CustomDataGrid
          hasNextPage={data?.hasNextPage || false}
          total={data?.total || 0}
          rows={data?.items || []}
          columns={columns}
          loading={isLoading}
          // toolbar={() => null}
          page={searchParams.page}
          limit={searchParams.limit}
          sort={searchParams.sort}
          order={searchParams.order}
          filterModel={{
            items: [],
            quickFilterValues: searchParams.search ? [searchParams.search] : [],
          }}
          onFilterModelChange={handleFilterModelChange}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          getRowId={(row) => row.id}
        />
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
