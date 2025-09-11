import type { ReactNode } from 'react';
import type { GridSlotProps, GridSortDirection } from '@mui/x-data-grid/models';

import { ptBR } from '@mui/x-data-grid/locales';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { gridClasses } from '@mui/x-data-grid/constants';
import { GridToolbar, type DataGridProps } from '@mui/x-data-grid/internals';

import { EmptyContent } from '../empty-content';
import { useToolbarSettings } from './toolbar-extend-settings';

type CustomDataGridProps = Omit<DataGridProps, 'paginationModel'> & {
  page: number;
  limit: number;
  hasNextPage: boolean;
  total: number;
  filters?: ReactNode;
  sort?: string;
  order?: 'asc' | 'desc';
  toolbar?: React.JSXElementConstructor<GridSlotProps['toolbar']> | null;
};

export default function CustomDataGrid(props: CustomDataGridProps) {
  const toolbarOptions = useToolbarSettings();

  return (
    <DataGrid
      {...toolbarOptions.settings}
      localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 20]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: props.limit, page: props.page },
          meta: { hasNextPage: props.hasNextPage },
          rowCount: props.total,
        },
      }}
      pagination
      paginationMode="server"
      paginationMeta={{ hasNextPage: props.hasNextPage }}
      paginationModel={{ page: props.page, pageSize: props.limit }}
      sortModel={props.sort ? [{ field: props.sort, sort: props.order as GridSortDirection }] : []}
      sortingMode="server"
      rowCount={props.total}
      filterMode="server"
      disableColumnFilter
      slots={{
        toolbar: props.toolbar ?? GridToolbar,
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
      getRowId={(row) => row.id}
      {...props}
      slotProps={{
        ...props.slotProps,
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: {
            debounceMs: 500,
            ...(props.slotProps as any)?.toolbar?.quickFilterProps,
          },
          ...(props.slotProps as any)?.toolbar,
        },
      }}
    />
  );
}
