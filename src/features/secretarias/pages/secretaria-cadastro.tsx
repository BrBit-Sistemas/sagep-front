import type { GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { secretariaToFormValues } from 'src/features/secretarias/helper';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

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

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de Secretarias"
        links={[
          { name: 'Secretarias' },
          { name: 'Cadastro de Secretarias', href: paths.secretarias.root },
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
          getRowId={(row) => row.id}
        />

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
