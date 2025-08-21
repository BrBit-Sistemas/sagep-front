import type { GridColDef } from '@mui/x-data-grid';

import { Stack, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { useProfissaoCadastroStore } from '../stores';

export const useProfissaoListTable = () => {
  const { openEditDialog, openDeleteDialog } = useProfissaoCadastroStore();

  const columns: GridColDef[] = [
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
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => openEditDialog(params.row)}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => openDeleteDialog(params.row)}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return { columns };
};
