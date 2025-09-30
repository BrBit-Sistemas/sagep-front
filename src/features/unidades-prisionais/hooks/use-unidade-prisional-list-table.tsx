import type { GridColDef } from '@mui/x-data-grid/models';
import type { GridActionsCellItemProps } from '@mui/x-data-grid';
import type { UnidadePrisional } from '../types';
import type { Regional } from 'src/features/regionais/types';

import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useUnidadePrisionalCadastroStore } from '../stores/unidade-prisional-cadastro-store';

export const useUnidadePrisionalListTable = () => {
  const theme = useTheme();
  const { openDeleteDialog, openEditDialog } = useUnidadePrisionalCadastroStore();
  const { isLoading, hasPermission } = usePermissionCheck();

  const onDelete = useCallback(
    (unidade: UnidadePrisional) => {
      openDeleteDialog(unidade);
    },
    [openDeleteDialog]
  );

  const onEdit = useCallback(
    (unidade: UnidadePrisional) => {
      openEditDialog(unidade);
    },
    [openEditDialog]
  );

  const columns = useMemo(
    (): GridColDef<UnidadePrisional>[] => [
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 2,
      },
      {
        field: 'regional',
        headerName: 'Regional',
        valueFormatter: (value: Regional) => value.nome,
        flex: 1,
      },
      {
        field: 'createdAt',
        headerName: 'Criado em',
        flex: 1,
        valueFormatter: (value) => fDateTime(value),
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        width: 64,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => {
          if (isLoading) return [] as React.ReactElement<GridActionsCellItemProps>[];
          const actions: React.ReactElement<GridActionsCellItemProps>[] = [];

          const canUpdate = hasPermission({ action: 'update', subject: 'unidades_prisionais' });
          const canDelete = hasPermission({ action: 'delete', subject: 'unidades_prisionais' });

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
