import type { GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { profissaoToFormValues } from '../helper';
import { useProfissaoList } from '../hooks/use-profissao-list';
import { useProfissaoListTable } from '../hooks/use-profissao-list-table';
import { useProfissaoCadastroStore } from '../stores/profissao-cadastro-store';
import { useProfissaoSearchParams } from '../hooks/use-profissao-search-params';
import { ProfissaoFormDialog } from '../components/cadastro/profissao-form-dialog';
import { ProfissaoDeleteDialog } from '../components/cadastro/profissao-delete-dialog';

export default function ProfissaoCadastroPage() {
  const [searchParams, setSearchParams] = useProfissaoSearchParams();

  const { selectedProfissao, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useProfissaoCadastroStore();

  const { data, isLoading } = useProfissaoList(searchParams);

  const { columns } = useProfissaoListTable();

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de Profissões"
        links={[
          { name: 'Profissões' },
          { name: 'Cadastro de Profissões', href: paths.profissoes.root },
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
          getRowId={(row) => row.profissao_id}
        />

        <ProfissaoFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedProfissao && {
            defaultValues: profissaoToFormValues(selectedProfissao),
            profissaoId: selectedProfissao.profissao_id,
          })}
        />

        <ProfissaoDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
