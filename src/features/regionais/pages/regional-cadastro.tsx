import type { GridPaginationModel } from '@mui/x-data-grid/models';

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
          onPaginationModelChange={handlePaginationModelChange}
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
