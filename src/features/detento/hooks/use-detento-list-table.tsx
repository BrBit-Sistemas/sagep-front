import type { GridColDef, GridActionsCellItemProps } from '@mui/x-data-grid';
import type { Detento } from '../types';

import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';
import { formatCpf } from 'src/utils/format-string';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useDetentoCadastroStore } from '../stores/detento-cadastro-store';

export const useDetentoListTable = () => {
  const theme = useTheme();
  const navigate = useRouter();
  const { openDeleteDialog, openEditDialog } = useDetentoCadastroStore();
  const { isLoading, hasPermission, hasAny } = usePermissionCheck();

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

  const columns = useMemo((): GridColDef<Detento>[] => {
    const cols: GridColDef<Detento>[] = [];

    // Always show name column
    cols.push({
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
    });

    const canReadDetentos = hasPermission({ action: 'read', subject: 'detentos' });
    const canReadFichaInterno = hasPermission({
      action: 'read',
      subject: 'ficha_cadastral_interno',
    });

    if (canReadDetentos) {
      cols.push({
        field: 'mae',
        headerName: 'Mãe',
        flex: 1,
        valueFormatter: (value: string) => value || '-',
      });

      cols.push({
        field: 'cpf',
        headerName: 'CPF',
        flex: 1,
        valueFormatter: (value: string) => formatCpf(value),
      });

      cols.push({
        field: 'createdAt',
        headerName: 'Criação do Reeducando',
        flex: 1,
        minWidth: 160,
        renderCell: ({ row }) => (
          <Typography component="span" variant="body2" noWrap>
            {row.createdAt ? fDateTime(row.createdAt) : '-'}
          </Typography>
        ),
      });
    }

    if (canReadFichaInterno) {
      // Coluna: Status da Ficha (badge)
      cols.push({
        field: 'status_validacao',
        headerName: 'Status da Ficha',
        flex: 1,
        minWidth: 160,
        sortable: false,
        renderCell: ({ row }) => {
          const raw =
            (row as any).status_validacao ||
            (row as any).ficha_status_validacao ||
            (row as any).ficha_status ||
            '';
          const status = String(raw).toUpperCase();
          const map: Record<
            string,
            { label: string; color: 'default' | 'success' | 'warning' | 'error' | 'info' }
          > = {
            VALIDADO: { label: 'Validada', color: 'success' },
            AGUARDANDO_VALIDACAO: { label: 'Aguardando validação', color: 'info' },
            REQUER_CORRECAO: { label: 'Requer correção', color: 'warning' },
            REJEITADA: { label: 'Rejeitada', color: 'error' },
            FILA_DISPONIVEL: { label: 'Na fila', color: 'info' },
          };
          const conf = map[status] || { label: '-', color: 'default' as const };
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                label={conf.label}
                color={conf.color}
                variant="soft"
              />
              {status === 'FILA_DISPONIVEL' && (row as any)?.posicao_fila ? (
                <Typography variant="caption" color="text.secondary">
                  #{(row as any).posicao_fila}
                </Typography>
              ) : null}
            </Box>
          );
        },
      });

      cols.push({
        field: 'ficha_cadastral_created_at',
        headerName: 'Criação da Ficha',
        flex: 1,
        minWidth: 160,
        renderCell: ({ row }) => (
          <Typography component="span" variant="body2" noWrap>
            {row.ficha_cadastral_created_at ? fDateTime(row.ficha_cadastral_created_at) : '-'}
          </Typography>
        ),
      });
    }

    cols.push({
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
      getActions: (params) => {
        if (isLoading) return [] as React.ReactElement<GridActionsCellItemProps>[];
        const actions: React.ReactElement<GridActionsCellItemProps>[] = [];
        const canUpdate = hasPermission({ action: 'update', subject: 'detentos' });
        const canDelete = hasPermission({ action: 'delete', subject: 'detentos' });
        const canRead = hasAny([
          { action: 'read', subject: 'detentos' },
          { action: 'read', subject: 'ficha_cadastral_interno' },
        ]);

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

        if (canRead) {
          actions.push(
            (
              <CustomGridActionsCellItem
                showInMenu
                label="Visualizar"
                icon={<Iconify icon="solar:eye-bold" />}
                onClick={() => onView(params.row)}
              />
            ) as unknown as React.ReactElement<GridActionsCellItemProps>
          );
        }

        return actions;
      },
    });

    return cols;
  }, [hasPermission, isLoading, onDelete, onEdit, onView, theme.vars.palette.error.main]);

  return { columns };
};
