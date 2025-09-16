import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { regionalToFormValues } from 'src/features/regionais/helper';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { useRegionalCadastroStore } from '../stores';
import { useListRegionais } from '../hooks/use-list-regionais';
import { useRegionalListTable } from '../hooks/use-regional-list-table';
import { RegionalFormDialog, RegionalDeleteDialog } from '../components';
import { useRegionalSearchParams } from '../hooks/use-regional-search-params';

export default function RegionalCadastroPage() {
  const [searchParams, setSearchParams] = useRegionalSearchParams();

  const { selectedRegional, isFormDialogOpen, openCreateDialog, closeFormDialog } =
    useRegionalCadastroStore();

  const { data, isLoading } = useListRegionais(searchParams);

  const { columns } = useRegionalListTable();

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
        heading="Cadastro de Regionais"
        links={[
          { name: 'Regionais' },
          { name: 'Cadastro de Regionais', href: paths.regionais.root },
        ]}
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
          filterModel={{
            items: [],
            quickFilterValues: searchParams.search ? [searchParams.search] : [],
          }}
          onFilterModelChange={handleFilterModelChange}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
        />

        <RegionalFormDialog
          open={isFormDialogOpen}
          onSuccess={closeFormDialog}
          onClose={closeFormDialog}
          {...(selectedRegional && {
            defaultValues: regionalToFormValues(selectedRegional),
            regionalId: selectedRegional.id,
          })}
        />

        <RegionalDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
