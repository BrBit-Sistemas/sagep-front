import type { GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { empresaConvenioToFormValues } from '../helper';
import { useEmpresaConvenioList } from '../hooks/use-empresa-convenio-list';
import { useEmpresaConvenioListTable } from '../hooks/use-empresa-convenio-list-table';
import { useEmpresaConvenioCadastroStore } from '../stores/empresa-convenio-cadastro-store';
import { useEmpresaConvenioSearchParams } from '../hooks/use-empresa-convenio-search-params';
import { EmpresaConvenioFormDialog } from '../components/cadastro/empresa-convenio-form-dialog';
import { EmpresaConvenioDeleteDialog } from '../components/cadastro/empresa-convenio-delete-dialog';

export default function EmpresaConvenioCadastroPage() {
  const [searchParams, setSearchParams] = useEmpresaConvenioSearchParams();

  const { selected, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useEmpresaConvenioCadastroStore();

  const { data, isLoading } = useEmpresaConvenioList(searchParams);
  const { columns } = useEmpresaConvenioListTable();

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Convênios de Empresas"
        links={[
          { name: 'Laboral' },
          { name: 'Convênios', href: paths.empresaConvenios.root },
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
          getRowId={(row) => row.convenio_id}
        />

        <EmpresaConvenioFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selected && {
            defaultValues: empresaConvenioToFormValues(selected),
            convenioId: selected.convenio_id,
          })}
        />

        <EmpresaConvenioDeleteDialog />
      </Card>
    </DashboardContent>
  );
}

