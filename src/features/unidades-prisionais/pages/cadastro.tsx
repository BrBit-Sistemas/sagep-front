import type { GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

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

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de Unidades Prisionais"
        links={[
          { name: 'Unidades Prisionais' },
          { name: 'Cadastro de Unidades Prisionais', href: paths.unidadesPrisionais.root },
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
          getRowId={(row) => row.unidade_id}
        />

        <UnidadePrisionalFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedUnidadePrisional && {
            defaultValues: unidadePrisionalToFormValues(selectedUnidadePrisional),
            unidadeId: selectedUnidadePrisional.unidade_id,
          })}
        />

        <UnidadePrisionalDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
