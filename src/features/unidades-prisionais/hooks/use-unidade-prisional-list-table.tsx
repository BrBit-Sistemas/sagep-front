import type { GridColDef } from '@mui/x-data-grid/models';
import type { UnidadePrisional } from '../types';

import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useUnidadePrisionalCadastroStore } from '../stores/unidade-prisional-cadastro-store';

export const useUnidadePrisionalListTable = () => {
  const theme = useTheme();
  const { openDeleteDialog, openEditDialog } = useUnidadePrisionalCadastroStore();

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
