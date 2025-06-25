import type { DataGridProps } from '@mui/x-data-grid/internals';

import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { gridClasses } from '@mui/x-data-grid/constants';

import { EmptyContent } from '../empty-content';
import { useToolbarSettings } from './toolbar-extend-settings';

type CustomDataGridProps = Omit<DataGridProps, 'paginationModel'> & {
  page: number;
  limit: number;
};

export default function CustomDataGrid(props: CustomDataGridProps) {
  const toolbarOptions = useToolbarSettings();

  return (
    <DataGrid
      {...toolbarOptions.settings}
      disableRowSelectionOnClick
      getRowHeight={() => 'auto'}
      pageSizeOptions={[5, 10, 20]}
      initialState={{ pagination: { paginationModel: { pageSize: props.limit } } }}
      paginationModel={{ page: props.page, pageSize: props.limit }}
      slots={{
        noRowsOverlay: () => <EmptyContent title="Nenhum resultado encontrado" />,
        noResultsOverlay: () => <EmptyContent title="Nenhum resultado encontrado" />,
        ...props.slots,
      }}
      sx={{
        [`& .${gridClasses.cell}`]: {
          display: 'flex',
          alignItems: 'center',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      }}
      {...props}
    />
  );
}
