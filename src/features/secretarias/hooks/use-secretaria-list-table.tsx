import type { GridColDef } from '@mui/x-data-grid';
import type { Secretaria } from 'src/api/generated.schemas';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useSecretariaCadastroStore } from '../stores';

export const useSecretariaListTable = () => {
  const theme = useTheme();
  const { openEditDialog, openDeleteDialog } = useSecretariaCadastroStore();

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
