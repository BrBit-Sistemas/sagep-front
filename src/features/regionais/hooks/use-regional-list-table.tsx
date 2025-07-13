import type { GridColDef } from '@mui/x-data-grid';
import type { Regional } from '../types';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useRegionalCadastroStore } from '../stores';

export const useRegionalListTable = () => {
  const theme = useTheme();
  const { openEditDialog, openDeleteDialog } = useRegionalCadastroStore();

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
