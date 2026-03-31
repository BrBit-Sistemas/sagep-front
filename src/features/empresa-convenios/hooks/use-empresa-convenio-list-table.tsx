import type { GridColDef } from '@mui/x-data-grid/models';
import type { GridActionsCellItemProps } from '@mui/x-data-grid';
import type { EmpresaConvenio } from '../types';

import { useNavigate } from 'react-router';
import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useEmpresasOptions } from './use-empresas-options';
import { useEmpresaConvenioCadastroStore } from '../stores/empresa-convenio-cadastro-store';

const modalidadeLabels: Record<string, string> = {
  INTRAMUROS: 'Intramuros',
  EXTRAMUROS: 'Extramuros',
};

const isConvenioAtivo = (dataFim: string | null | undefined): boolean => {
  if (!dataFim) return true;
  const fim = new Date(`${dataFim}T12:00:00`);
  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);
  return fim >= hoje;
};

export const useEmpresaConvenioListTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { openDeleteDialog } = useEmpresaConvenioCadastroStore();
  const { isLoading, hasPermission } = usePermissionCheck();
  const { indexMap: empresasIndex } = useEmpresasOptions('');

  const onDelete = useCallback(
    (item: EmpresaConvenio) => openDeleteDialog(item),
    [openDeleteDialog]
  );

  const onEdit = useCallback(
    (item: EmpresaConvenio) => navigate(paths.empresaConvenios.edit(item.convenio_id)),
    [navigate]
  );

  const columns = useMemo(
    (): GridColDef<EmpresaConvenio>[] => [
      {
        field: 'empresa_id',
        headerName: 'Empresa',
        flex: 2,
        valueFormatter: (value) => empresasIndex.get(value as string) ?? (value as string),
      },
      {
        field: 'modalidade_execucao',
        headerName: 'Modalidade de execução',
        flex: 1,
        valueFormatter: (value) => modalidadeLabels[value as string] ?? (value as string),
      },
      {
        field: 'max_reeducandos',
        headerName: 'Máx. reeducandos',
        flex: 1,
        valueFormatter: (value) => (value != null && value !== '' ? String(value) : '—'),
      },
      {
        field: 'data_inicio',
        headerName: 'Início',
        flex: 1,
        valueFormatter: (value) => formatDateToDDMMYYYY(value as string),
      },
      {
        field: 'data_fim',
        headerName: 'Fim',
        flex: 1,
        valueFormatter: (value) => (value ? formatDateToDDMMYYYY(value as string) : '—'),
      },
      {
        field: 'vigencia',
        headerName: 'Vigência',
        flex: 1,
        sortable: false,
        filterable: false,
        valueGetter: (_value, row) => (isConvenioAtivo(row.data_fim) ? 'ATIVO' : 'ENCERRADO'),
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

          const canUpdate = hasPermission({ action: 'update', subject: 'empresas_convenio' });
          const canDelete = hasPermission({ action: 'delete', subject: 'empresas_convenio' });

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

          return actions;
        },
      },
    ],
    [empresasIndex, isLoading, hasPermission, onDelete, onEdit, theme.vars.palette.error.main]
  );

  return { columns };
};
