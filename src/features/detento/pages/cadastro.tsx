import type { GridPaginationModel } from '@mui/x-data-grid/models';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import CustomDataGrid from 'src/components/custom-data-grid/custom-data-grid';

import { useDetentoList } from '../hooks/use-detento-list';
import { useDetentoListTable } from '../hooks/use-detento-list-table';
import { useDetentoSearchParams } from '../hooks/use-detento-search-params';

export default function DetentoCadastroPage() {
  const [searchParams, setSearchParams] = useDetentoSearchParams();
  const { data: detentos = [], isLoading } = useDetentoList(searchParams);
  const { columns } = useDetentoListTable();

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setSearchParams({ page: newModel.page, limit: newModel.pageSize });
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="List"
        links={[{ name: 'Detentos' }, { name: 'Cadastro de detentos', href: paths.detentos.root }]}
        action={
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
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
          rows={detentos}
          columns={columns}
          loading={isLoading}
          page={searchParams.page}
          limit={searchParams.limit}
          onPaginationModelChange={handlePaginationModelChange}
        />
      </Card>
    </DashboardContent>
  );
}
