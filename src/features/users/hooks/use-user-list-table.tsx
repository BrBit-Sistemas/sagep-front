import type { GridColDef } from '@mui/x-data-grid/models';
import type { GridActionsCellItemProps } from '@mui/x-data-grid';
import type { User } from 'src/features/users/types';

import { useMemo, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

import { useUserCadastroStore } from 'src/features/users/stores/user-cadastro-store';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

export const useUserListTable = () => {
  const theme = useTheme();
  const { openDeleteDialog, openEditDialog } = useUserCadastroStore();
  const { isLoading, hasPermission } = usePermissionCheck();

  const onDelete = useCallback(
    (user: User) => {
      openDeleteDialog(user);
    },
    [openDeleteDialog]
  );

  const onEdit = useCallback(
    (user: User) => {
      openEditDialog(user);
    },
    [openEditDialog]
  );

  const columns = useMemo(
    (): GridColDef<User>[] => [
      {
        field: 'name',
        headerName: 'Nome',
        flex: 1,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={params.row.nome} src={params.row?.avatarUrl || ''}>
              {params.row?.nome?.charAt(0)}
            </Avatar>
            <Typography variant="body2">{params.row?.nome}</Typography>
          </Stack>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
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

          const canUpdate = hasPermission({ action: 'update', subject: 'usuarios' });
          const canDelete = hasPermission({ action: 'delete', subject: 'usuarios' });

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
    [isLoading, hasPermission, onDelete, onEdit, theme]
  );

  return { columns };
};
