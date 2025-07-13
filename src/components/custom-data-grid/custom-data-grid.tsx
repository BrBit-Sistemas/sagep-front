import type { ReactNode } from 'react';
import type { DataGridProps } from '@mui/x-data-grid/internals';
import type { GridSortDirection } from '@mui/x-data-grid/models';

import { ptBR } from '@mui/x-data-grid/locales';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { Toolbar } from '@mui/x-data-grid/components';
import { gridClasses } from '@mui/x-data-grid/constants';

import { EmptyContent } from '../empty-content';
import { useToolbarSettings, CustomToolbarSettingsButton } from './toolbar-extend-settings';
import {
  ToolbarContainer,
  ToolbarLeftPanel,
  ToolbarRightPanel,
  CustomToolbarQuickFilter,
  CustomToolbarExportButton,
  CustomToolbarColumnsButton,
} from './toolbar-core';

type CustomDataGridProps = Omit<DataGridProps, 'paginationModel'> & {
  page: number;
  limit: number;
  hasNextPage: boolean;
  total: number;
  filters?: ReactNode;
  sort?: string;
  order?: 'asc' | 'desc';
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
      sortModel={[{ field: props?.sort || '', sort: props?.order as GridSortDirection }]}
      sortingMode="server"
      rowCount={props.total}
      filterMode="server"
      disableColumnFilter
      slots={{
        toolbar: () => (
          <Toolbar>
            <ToolbarContainer>
              <ToolbarLeftPanel>
                {props.filters}
                <CustomToolbarQuickFilter />
              </ToolbarLeftPanel>
              <ToolbarRightPanel>
                <CustomToolbarExportButton showLabel={false} />
                <CustomToolbarColumnsButton showLabel={false} />
                <CustomToolbarSettingsButton
                  showLabel={false}
                  settings={toolbarOptions.settings}
                  onChangeSettings={toolbarOptions.onChangeSettings}
                />
              </ToolbarRightPanel>
            </ToolbarContainer>
          </Toolbar>
        ),
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
    />
  );
}
