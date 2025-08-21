import type { GridColDef } from '@mui/x-data-grid';

import { useMemo } from 'react';

import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useProfissaoCadastroStore } from '../stores';

export const useProfissaoListTable = () => {
  const { openEditDialog, openDeleteDialog } = useProfissaoCadastroStore();
  const theme = useTheme();
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
        valueFormatter: (params) => new Date(params).toLocaleDateString('pt-BR'),
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
        getActions: (params) => [
          <CustomGridActionsCellItem
            showInMenu
            label="Editar"
            icon={<Iconify icon="solar:pen-bold" />}
            onClick={() => openEditDialog(params.row)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Excluir"
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => openDeleteDialog(params.row)}
            style={{ color: theme.vars.palette.error.main }}
          />,
        ],
      },
    ],
    [openDeleteDialog, openEditDialog, theme.vars.palette.error.main]
  );

  return { columns };
};
