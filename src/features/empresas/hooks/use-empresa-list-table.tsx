import type { GridColDef } from '@mui/x-data-grid/models';
import type { Empresa } from '../types';

import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { formatCnpj } from 'src/utils/format-string';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useEmpresaCadastroStore } from '../stores/empresa-cadastro-store';

export const useEmpresaListTable = () => {
  const theme = useTheme();
  const { openDeleteDialog, openEditDialog } = useEmpresaCadastroStore();

  const onDelete = useCallback(
    (empresa: Empresa) => {
      openDeleteDialog(empresa);
    },
    [openDeleteDialog]
  );

  const onEdit = useCallback(
    (empresa: Empresa) => {
      openEditDialog(empresa);
    },
    [openEditDialog]
  );

  const columns = useMemo(
    (): GridColDef<Empresa>[] => [
      {
        field: 'razao_social',
        headerName: 'Razão Social',
        flex: 2,
      },
      {
        field: 'cnpj',
        headerName: 'CNPJ',
        flex: 1,
        valueFormatter: (value: string) => formatCnpj(value),
      },
      {
        field: 'createdAt',
        headerName: 'Criado em',
        flex: 1,
        valueFormatter: (value) => new Date(value).toLocaleDateString('pt-BR'),
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
