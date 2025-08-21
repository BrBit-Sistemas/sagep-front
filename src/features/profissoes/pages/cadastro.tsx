import type { GridPaginationModel } from '@mui/x-data-grid';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { profissaoToFormValues } from 'src/features/profissoes/helper';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { useProfissaoCadastroStore } from '../stores';
import { useListProfissoes } from '../hooks/use-list-profissoes';
import { useProfissaoListTable } from '../hooks/use-profissao-list-table';
import { ProfissaoFormDialog, ProfissaoDeleteDialog } from '../components';
import { useProfissaoSearchParams } from '../hooks/use-profissao-search-params';

export default function ProfissaoCadastroPage() {
  const [searchParams, setSearchParams] = useProfissaoSearchParams();

  const { selectedProfissao, isFormDialogOpen, openCreateDialog, closeFormDialog } =
    useProfissaoCadastroStore();

  const { data, isLoading } = useListProfissoes(searchParams);

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
        />

        <ProfissaoFormDialog
          open={isFormDialogOpen}
          onSuccess={closeFormDialog}
          onClose={closeFormDialog}
          {...(selectedProfissao && {
            defaultValues: profissaoToFormValues(selectedProfissao),
            profissaoId: selectedProfissao.id,
          })}
        />

        <ProfissaoDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
