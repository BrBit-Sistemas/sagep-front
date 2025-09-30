import type { GridColDef, GridActionsCellItemProps } from '@mui/x-data-grid';
import type { Secretaria } from 'src/api/generated.schemas';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useSecretariaCadastroStore } from '../stores';

export const useSecretariaListTable = () => {
  const theme = useTheme();
  const { openEditDialog, openDeleteDialog } = useSecretariaCadastroStore();
  const { isLoading, hasPermission } = usePermissionCheck();

  const onEdit = (secretaria: Secretaria) => {
    openEditDialog(secretaria);
  };

  const onDelete = (secretaria: Secretaria) => {
    openDeleteDialog(secretaria);
  };

  const columns = useMemo(
    (): GridColDef<Secretaria>[] => [
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

          const canUpdate = hasPermission({ action: 'update', subject: 'secretarias' });
          const canDelete = hasPermission({ action: 'delete', subject: 'secretarias' });

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
