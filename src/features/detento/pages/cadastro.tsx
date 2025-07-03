import type { GridSortModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

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

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de detentos"
        links={[{ name: 'Detentos' }, { name: 'Cadastro de detentos', href: paths.detentos.root }]}
        action={
          <Button
            color="primary"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openCreateDialog}
          >
            Adicionar
          </Button>
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
          page={searchParams.page}
          limit={searchParams.limit}
          sort={searchParams.sort}
          order={searchParams.order}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          getRowId={(row) => row.detento_id}
        />

        <DetentoFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedDetento && {
            defaultValues: detentoToFormValues(selectedDetento),
            detentoId: selectedDetento.detento_id,
          })}
        />

        <DetentoDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
