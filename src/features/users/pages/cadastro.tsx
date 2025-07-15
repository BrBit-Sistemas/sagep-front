import type { GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { userToFormValues } from '../helper';
import { useUserList } from '../hooks/use-user-list';
import { useUserListTable } from '../hooks/use-user-list-table';
import { useUserCadastroStore } from '../stores/user-cadastro-store';
import { useUserSearchParams } from '../hooks/use-user-search-params';
import { UserFormDialog } from '../components/cadastro/user-form-dialog';
import { UserDeleteDialog } from '../components/cadastro/user-delete-dialog';

export default function UserCadastroPage() {
  const [searchParams, setSearchParams] = useUserSearchParams();

  const { selectedUser, isFormDialogOpen, openCreateDialog, closeCreateDialog } =
    useUserCadastroStore();

  const { data, isLoading } = useUserList(searchParams);

  const { columns } = useUserListTable();

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Cadastro de Usuários"
        links={[{ name: 'Usuários' }, { name: 'Cadastro de Usuários', href: paths.users.root }]}
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

        <UserFormDialog
          open={isFormDialogOpen}
          onSuccess={closeCreateDialog}
          onClose={closeCreateDialog}
          {...(selectedUser && {
            defaultValues: userToFormValues(selectedUser),
            userId: selectedUser.id,
          })}
        />

        <UserDeleteDialog />
      </Card>
    </DashboardContent>
  );
}
