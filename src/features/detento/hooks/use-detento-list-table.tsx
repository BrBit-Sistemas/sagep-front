import type { GridColDef } from '@mui/x-data-grid/models';
import type { Detento } from '../types';

import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatCpf } from 'src/utils/format-string';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useDetentoCadastroStore } from '../stores/detento-cadastro-store';

export const useDetentoListTable = () => {
  const theme = useTheme();
  const navigate = useRouter();
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

  const onView = useCallback(
    (detento: Detento) => {
      navigate.push(paths.detentos.detalhes(detento.id));
    },
    [navigate]
  );

  const columns = useMemo(
    (): GridColDef<Detento>[] => [
      {
        field: 'nome',
        headerName: 'Nome',
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={params.row.nome} sx={{ width: 32, height: 32 }}>
              {params.row.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Typography component="span" variant="body2" noWrap>
              {params.row.nome}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'mae',
        headerName: 'Mãe',
        flex: 1,
        valueFormatter: (value: string) => value || '-',
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
          <CustomGridActionsCellItem
            showInMenu
            label="Visualizar"
            icon={<Iconify icon="solar:eye-bold" />}
            onClick={() => onView(params.row)}
          />,
        ],
      },
    ],
    [onDelete, onEdit, onView, theme.vars.palette.error.main]
  );

  return { columns };
};
