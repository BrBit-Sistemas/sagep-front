import type { GridColDef, GridActionsCellItemProps } from '@mui/x-data-grid';
import type { Regional } from '../types';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useRegionalCadastroStore } from '../stores';

export const useRegionalListTable = () => {
  const theme = useTheme();
  const { openEditDialog, openDeleteDialog } = useRegionalCadastroStore();
  const { isLoading, hasPermission } = usePermissionCheck();

  const onEdit = (regional: Regional) => {
    openEditDialog(regional);
  };

  const onDelete = (regional: Regional) => {
    openDeleteDialog(regional);
  };

  const columns = useMemo(
    (): GridColDef<Regional>[] => [
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="subtitle2" noWrap>
            {params.row.nome}
          </Typography>
        ),
      },
      {
        field: 'secretaria',
        headerName: 'Secretaria',
        flex: 1,
        valueGetter: (value, row) => row.secretaria?.nome || 'N/A',
      },
      {
        field: 'unidades',
        headerName: 'Unidades',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        valueGetter: (value, row) => row.unidades?.length || 0,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        width: 80,
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

          const canUpdate = hasPermission({ action: 'update', subject: 'regionais' });
          const canDelete = hasPermission({ action: 'delete', subject: 'regionais' });

          if (canUpdate) {
            actions.push(
              (
                <CustomGridActionsCellItem
                  showInMenu
                  label="Editar"
                  icon={<Iconify icon="solar:pen-bold" />}
                  onClick={() => onEdit(params.row)}
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
                  onClick={() => onDelete(params.row)}
                  style={{ color: theme.vars.palette.error.main }}
                />
              ) as unknown as React.ReactElement<GridActionsCellItemProps>
            );
          }

          return actions;
        },
      },
    ],
    [isLoading, hasPermission, onDelete, onEdit, theme.vars.palette.error.main]
  );

  return { columns };
};
