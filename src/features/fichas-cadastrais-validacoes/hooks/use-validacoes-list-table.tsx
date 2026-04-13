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
    (row: FichaCadastralValidacao) => openDetails(row.id),
    [openDetails]
  );

  const onRequererCorrecao = useCallback(
    (row: FichaCadastralValidacao) => {
      openDetails(row.id);
      openReprovar();
    },
    [openDetails, openReprovar]
  );

  const onRevalidar = useCallback(
    (row: FichaCadastralValidacao) => {
      openDetails(row.id);
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
        field: 'prontuario',
        headerName: 'Prontuário',
        flex: 1,
        minWidth: 130,
        sortable: false,
        valueGetter: (_v, row) => row.detento?.prontuario ?? row.prontuario ?? '',
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
        field: 'status_validacao',
        headerName: 'Validação',
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => <StatusChip status={row.status_validacao} />,
      },
      {
        field: 'motivo_reprovacao',
        headerName: 'Motivo',
        flex: 2,
        minWidth: 240,
        renderCell: ({ row }) =>
          row.motivo_reprovacao ? (
            <Tooltip title={row.motivo_reprovacao} placement="top-start">
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'error.main',
                }}
              >
                {row.motivo_reprovacao}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2" color="text.disabled">
              —
            </Typography>
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

          if (canValidar) {
            if (params.row.status_validacao === 'AGUARDANDO_VALIDACAO') {
              actions.push(
                (
                  <CustomGridActionsCellItem
                    showInMenu
                    label="Requerer correção"
                    icon={<Iconify icon="solar:close-circle-bold" />}
                    onClick={() => onRequererCorrecao(params.row)}
                  />
                ) as unknown as React.ReactElement<GridActionsCellItemProps>
              );
            } else {
              actions.push(
                (
                  <CustomGridActionsCellItem
                    showInMenu
                    label="Reabrir análise"
                    icon={<Iconify icon="solar:restart-bold" />}
                    onClick={() => onRevalidar(params.row)}
                  />
                ) as unknown as React.ReactElement<GridActionsCellItemProps>
              );
            }
          }

          return actions;
        },
      },
    ],
    [isLoading, hasPermission, onView, onRequererCorrecao, onRevalidar]
  );

  return { columns };
};
