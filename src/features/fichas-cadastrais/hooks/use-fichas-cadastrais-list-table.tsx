import type { GridColDef } from '@mui/x-data-grid/models';
import type { GridActionsCellItemProps } from '@mui/x-data-grid';
import type { FichaCadastral } from '../types';

import { useMemo, useCallback } from 'react';

import { Box, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { StatusChip } from 'src/components/status-chip';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { fichasCadastraisPermissions } from '../constants/permissions';

export const useFichasCadastraisListTable = () => {
  const router = useRouter();
  const { isLoading, hasPermission } = usePermissionCheck();

  const onEdit = useCallback(
    (row: FichaCadastral) => {
      if (row.detento_id && row.id) {
        router.push(paths.carceragem.reeducandos.fichaCadastralEdit(row.detento_id, row.id));
      }
    },
    [router]
  );

  const onViewDetento = useCallback(
    (row: FichaCadastral) => {
      if (row.detento_id) {
        router.push(`${paths.carceragem.reeducandos.detalhes(row.detento_id)}?t=ficha_cadastral`);
      }
    },
    [router]
  );

  const columns = useMemo(
    (): GridColDef<FichaCadastral>[] => [
      {
        field: 'detento_nome',
        headerName: 'Reeducando',
        flex: 2,
        minWidth: 240,
        sortable: false,
        valueGetter: (_v, row) => row.detento?.nome ?? row.nome ?? '',
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {row.detento?.nome ?? row.nome ?? '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Prontuário: {row.detento?.prontuario ?? row.prontuario ?? '—'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'cpf',
        headerName: 'CPF',
        flex: 1,
        minWidth: 140,
        sortable: false,
        valueGetter: (_v, row) => row.detento?.cpf ?? row.cpf ?? '',
      },
      {
        field: 'unidade_prisional',
        headerName: 'Unidade',
        flex: 1,
        minWidth: 180,
        sortable: false,
        valueGetter: (_v, row) => row.unidade_prisional ?? '',
      },
      {
        field: 'status_validacao',
        headerName: 'Validação',
        flex: 1,
        minWidth: 160,
        renderCell: ({ row }) => <StatusChip status={row.status_validacao} />,
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

          const canEdit = hasPermission(fichasCadastraisPermissions.update);

          actions.push(
            (
              <CustomGridActionsCellItem
                showInMenu
                label="Ver reeducando"
                icon={<Iconify icon="solar:user-id-bold" />}
                onClick={() => onViewDetento(params.row)}
              />
            ) as unknown as React.ReactElement<GridActionsCellItemProps>
          );

          if (canEdit) {
            actions.push(
              (
                <CustomGridActionsCellItem
                  showInMenu
                  label="Editar ficha"
                  icon={<Iconify icon="solar:pen-bold" />}
                  onClick={() => onEdit(params.row)}
                />
              ) as unknown as React.ReactElement<GridActionsCellItemProps>
            );

          }

          return actions;
        },
      },
    ],
    [isLoading, hasPermission, onEdit, onViewDetento]
  );

  return { columns };
};
