import type { GridColDef } from '@mui/x-data-grid/models';
import type { GridActionsCellItemProps } from '@mui/x-data-grid';
import type { FichaCadastralValidacao } from '../types';

import { useMemo, useCallback } from 'react';

import { Box, Tooltip, Typography } from '@mui/material';

import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { StatusChip } from '../components/status-chip';
import { useValidacaoStore } from '../stores/validacao-store';
import { validacoesPermissions } from '../constants/permissions';

export const useValidacoesListTable = () => {
  const openDetails = useValidacaoStore((s) => s.openDetails);
  const openReprovar = useValidacaoStore((s) => s.openReprovar);
  const openRevalidar = useValidacaoStore((s) => s.openRevalidar);
  const { isLoading, hasPermission } = usePermissionCheck();

  const onView = useCallback(
    (row: FichaCadastralValidacao) => openDetails(row.ficha_cadastral_id),
    [openDetails]
  );

  const onReprovar = useCallback(
    (row: FichaCadastralValidacao) => {
      openDetails(row.ficha_cadastral_id);
      openReprovar();
    },
    [openDetails, openReprovar]
  );

  const onRevalidar = useCallback(
    (row: FichaCadastralValidacao) => {
      openDetails(row.ficha_cadastral_id);
      openRevalidar();
    },
    [openDetails, openRevalidar]
  );

  const columns = useMemo(
    (): GridColDef<FichaCadastralValidacao>[] => [
      {
        field: 'detento_nome',
        headerName: 'Reeducando',
        flex: 2,
        minWidth: 220,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {row.detento_nome}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Matrícula: {row.matricula || '—'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'matricula',
        headerName: 'Matrícula',
        flex: 1,
        minWidth: 120,
        valueGetter: (_v, row) => row.matricula || '',
      },
      {
        field: 'ficha_cadastral_numero',
        headerName: 'Ficha',
        flex: 1,
        minWidth: 140,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2">{row.ficha_cadastral_numero || '—'}</Typography>
            <Typography
              variant="caption"
              sx={{
                color: row.ficha_cadastral_status === 'ATIVA' ? 'success.main' : 'text.disabled',
                fontWeight: 600,
              }}
            >
              {row.ficha_cadastral_status}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Validação',
        flex: 1,
        minWidth: 130,
        renderCell: ({ row }) => <StatusChip status={row.status} />,
      },
      {
        field: 'motivo_rejeicao',
        headerName: 'Motivo',
        flex: 2,
        minWidth: 220,
        renderCell: ({ row }) =>
          row.motivo_rejeicao ? (
            <Tooltip title={row.motivo_rejeicao} placement="top-start">
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'error.main',
                }}
              >
                {row.motivo_rejeicao}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2" color="text.disabled">—</Typography>
          ),
      },
      {
        field: 'validado_em',
        headerName: 'Validado em',
        flex: 1,
        minWidth: 140,
        valueFormatter: (value) => (value ? formatDateToDDMMYYYY(value as string) : '—'),
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

          const canValidar = hasPermission(validacoesPermissions.validar);
          const canRevalidar = hasPermission(validacoesPermissions.revalidar);

          actions.push(
            (
              <CustomGridActionsCellItem
                showInMenu
                label="Ver detalhes"
                icon={<Iconify icon="solar:eye-bold" />}
                onClick={() => onView(params.row)}
              />
            ) as unknown as React.ReactElement<GridActionsCellItemProps>
          );

          if (canValidar && params.row.status === 'PENDENTE') {
            actions.push(
              (
                <CustomGridActionsCellItem
                  showInMenu
                  label="Reprovar"
                  icon={<Iconify icon="solar:close-circle-bold" />}
                  onClick={() => onReprovar(params.row)}
                />
              ) as unknown as React.ReactElement<GridActionsCellItemProps>
            );
          }

          if (canRevalidar && params.row.status !== 'PENDENTE') {
            actions.push(
              (
                <CustomGridActionsCellItem
                  showInMenu
                  label="Revalidar"
                  icon={<Iconify icon="solar:restart-bold" />}
                  onClick={() => onRevalidar(params.row)}
                />
              ) as unknown as React.ReactElement<GridActionsCellItemProps>
            );
          }

          return actions;
        },
      },
    ],
    [isLoading, hasPermission, onView, onReprovar, onRevalidar]
  );

  return { columns };
};
