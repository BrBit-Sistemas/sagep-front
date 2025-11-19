import type { GridColDef, GridActionsCellItemProps } from '@mui/x-data-grid';

import { useMemo } from 'react';

import { useTheme } from '@mui/material/styles';

import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useProfissaoCadastroStore } from '../stores';

export const useProfissaoListTable = () => {
  const { openEditDialog, openDeleteDialog } = useProfissaoCadastroStore();
  const theme = useTheme();
  const { isLoading, hasPermission } = usePermissionCheck();
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'descricao',
        headerName: 'Descrição',
        flex: 1,
        minWidth: 300,
      },
      {
        field: 'ativo',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
          <span style={{ color: params.value ? 'green' : 'red' }}>
            {params.value ? 'Ativo' : 'Inativo'}
          </span>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Data de Criação',
        width: 150,
        valueFormatter: (params) => formatDateToDDMMYYYY(params as string),
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        width: 64,
        align: 'right',
        headerAlign: 'right',
        disableReorder: true,
        hideable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => {
          if (isLoading) return [] as React.ReactElement<GridActionsCellItemProps>[];
          const actions: React.ReactElement<GridActionsCellItemProps>[] = [];

          const canUpdate = hasPermission({ action: 'update', subject: 'profissoes' });
          const canDelete = hasPermission({ action: 'delete', subject: 'profissoes' });

          if (canUpdate) {
            actions.push(
              (
                <CustomGridActionsCellItem
                  showInMenu
                  label="Editar"
                  icon={<Iconify icon="solar:pen-bold" />}
                  onClick={() => openEditDialog(params.row)}
                />
              ) as unknown as React.ReactElement<GridActionsCellItemProps>
            );
          }

          if (canDelete) {
            actions.push(
              (
                <CustomGridActionsCellItem
                  showInMenu
                  label="Excluir"
                  icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => openDeleteDialog(params.row)}
                  style={{ color: theme.vars.palette.error.main }}
                />
              ) as unknown as React.ReactElement<GridActionsCellItemProps>
            );
          }

          return actions;
        },
      },
    ],
    [isLoading, hasPermission, openDeleteDialog, openEditDialog, theme.vars.palette.error.main]
  );

  return { columns };
};
