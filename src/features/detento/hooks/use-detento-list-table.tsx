import type { GridColDef } from '@mui/x-data-grid/models';
import type { Detento } from '../types';

import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { formatCpf } from 'src/utils/format-string';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useDetentoCadastroStore } from '../stores/detento-cadastro-store';

export const useDetentoListTable = () => {
  const theme = useTheme();
  const { openDeleteDialog, openEditDialog } = useDetentoCadastroStore();

  const onDelete = useCallback(
    (detento: Detento) => {
      openDeleteDialog(detento);
    },
    [openDeleteDialog]
  );

  const onEdit = useCallback(
    (detento: Detento) => {
      openEditDialog(detento);
    },
    [openEditDialog]
  );

  const columns = useMemo(
    (): GridColDef<Detento>[] => [
      {
        field: 'detento_id',
        headerName: 'ID',
        flex: 1,
      },
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 1,
      },
      {
        field: 'cpf',
        headerName: 'CPF',
        flex: 1,
        valueFormatter: (value: string) => formatCpf(value),
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
        getActions: (params) => [
          <CustomGridActionsCellItem
            showInMenu
            label="Editar"
            icon={<Iconify icon="solar:pen-bold" />}
            onClick={() => onEdit(params.row)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Excluir"
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => onDelete(params.row)}
            style={{ color: theme.vars.palette.error.main }}
          />,
        ],
      },
    ],
    [onDelete, onEdit, theme.vars.palette.error.main]
  );

  return { columns };
};
