import type { GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

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
        heading="Cadastro de Empresas"
        links={[{ name: 'Empresas' }, { name: 'Cadastro de Empresas', href: paths.empresas.root }]}
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
          getRowId={(row) => row.empresa_id}
        />

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
