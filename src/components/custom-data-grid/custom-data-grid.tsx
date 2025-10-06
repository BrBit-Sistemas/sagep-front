import type { ReactNode } from 'react';
import type { GridSlotProps, GridFilterModel, GridSortDirection } from '@mui/x-data-grid/models';

import { useRef, useMemo } from 'react';

import { ptBR } from '@mui/x-data-grid/locales';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { gridClasses } from '@mui/x-data-grid/constants';
import { GridToolbar, type DataGridProps } from '@mui/x-data-grid/internals';

import { EmptyContent } from '../empty-content';
import { useToolbarSettings } from './toolbar-extend-settings';

type CustomDataGridProps = Omit<DataGridProps, 'dataSource'> & {
  // Server-side data props
  rows: any[];
  total: number;
  loading?: boolean;

  // Pagination props
  page: number;
  limit: number;
  hasNextPage: boolean;

  // Sorting props
  sort?: string;
  order?: 'asc' | 'desc';

  // Filter props
  search?: string;

  // Event handlers
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  onSortModelChange: (model: { field: string; sort: 'asc' | 'desc' }[]) => void;
  onFilterModelChange: (model: GridFilterModel) => void;

  // UI props
  filters?: ReactNode;
  toolbar?: React.JSXElementConstructor<GridSlotProps['toolbar']> | null;
};

export default function CustomDataGrid(props: CustomDataGridProps) {
  const toolbarOptions = useToolbarSettings();
  const lastPaginationCall = useRef<{ page: number; pageSize: number; timestamp: number } | null>(null);

  // Memoizar objetos para evitar re-renderizações desnecessárias
  const paginationModel = useMemo(
    () => {
      const model = {
        page: Math.max(0, props.page - 1),
        pageSize: props.limit,
      };
      return model;
    },
    [props.page, props.limit]
  );

  const sortModel = useMemo(
    () => (props.sort ? [{ field: props.sort, sort: props.order as GridSortDirection }] : []),
    [props.sort, props.order]
  );

  const filterModel = useMemo(
    () => ({
      items: [],
      quickFilterValues: props.search ? [props.search] : [],
    }),
    [props.search]
  );

  return (
    <DataGrid
      {...toolbarOptions.settings}
      localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 20]}
      pagination
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={(model) => {
        // Evitar loops infinitos verificando se realmente mudou
        const newPage = Math.max(1, model.page + 1); // Garantir que nunca seja menor que 1
        const newPageSize = model.pageSize;
        const now = Date.now();


        // Se apenas o pageSize mudou, calcular a página correta baseada na posição atual
        if (newPageSize !== props.limit && model.page === 0) {
          // Calcular qual item estamos vendo atualmente
          const currentItemIndex = Math.max(0, (props.page - 1) * props.limit);
          const newPageForCurrentItem = Math.max(1, Math.floor(currentItemIndex / newPageSize) + 1);
          
          
          lastPaginationCall.current = { page: newPageForCurrentItem, pageSize: newPageSize, timestamp: now };
          // Passar diretamente a página calculada (já é 1-based)
          props.onPaginationModelChange({
            page: newPageForCurrentItem,
            pageSize: newPageSize,
          });
          return;
        }

        // Debounce: ignorar chamadas muito próximas (menos de 100ms)
        if (lastPaginationCall.current) {
          const timeDiff = now - lastPaginationCall.current.timestamp;
          const sameCall = lastPaginationCall.current.page === newPage && 
                          lastPaginationCall.current.pageSize === newPageSize;
          
          if (timeDiff < 100 && sameCall) {
            return;
          }
          
          // Ignorar chamadas que vão para trás quando deveriam ir para frente
          if (timeDiff < 200 && newPage < lastPaginationCall.current.page) {
            return;
          }
        }

        if (newPage !== props.page || newPageSize !== props.limit) {
          lastPaginationCall.current = { page: newPage, pageSize: newPageSize, timestamp: now };
          props.onPaginationModelChange({
            page: newPage,
            pageSize: newPageSize,
          });
        }
      }}
      sortModel={sortModel}
      sortingMode="server"
      onSortModelChange={(model) => {
        if (model.length > 0) {
          props.onSortModelChange([
            {
              field: model[0].field,
              sort: model[0].sort as 'asc' | 'desc',
            },
          ]);
        } else {
          props.onSortModelChange([]);
        }
      }}
      rowCount={props.total}
      filterMode="server"
      disableColumnFilter
      filterModel={filterModel}
      onFilterModelChange={(model) => {
        props.onFilterModelChange(model);
      }}
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
      rows={props.rows}
      columns={props.columns}
      loading={props.loading}
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
