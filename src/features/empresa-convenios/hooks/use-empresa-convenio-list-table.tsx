import type { GridColDef } from '@mui/x-data-grid/models';
import type { EmpresaConvenio } from '../types';

import { useMemo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { empresas as empresasMock } from 'src/features/empresas/data';

import { Iconify } from 'src/components/iconify';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { convenioTipos } from '../data';
import { useEmpresaConvenioCadastroStore } from '../stores/empresa-convenio-cadastro-store';

export const useEmpresaConvenioListTable = () => {
  const theme = useTheme();
  const { openDeleteDialog, openEditDialog } = useEmpresaConvenioCadastroStore();

  const empresasIndex = useMemo(
    () => new Map(empresasMock.map((e) => [e.empresa_id, e.razao_social])),
    []
  );
  const tiposIndex = useMemo(
    () => new Map(convenioTipos.map((t) => [t.codigo, t.descricao])),
    []
  );

  const onDelete = useCallback(
    (item: EmpresaConvenio) => openDeleteDialog(item),
    [openDeleteDialog]
  );

  const onEdit = useCallback((item: EmpresaConvenio) => openEditDialog(item), [openEditDialog]);

  const columns = useMemo(
    (): GridColDef<EmpresaConvenio>[] => [
      { field: 'convenio_id', headerName: 'ID', flex: 1 },
      {
        field: 'empresa_id',
        headerName: 'Empresa',
        flex: 2,
        valueFormatter: (value) => empresasIndex.get(value as string) ?? (value as string),
      },
      {
        field: 'tipo_codigo',
        headerName: 'Tipo',
        flex: 1,
        valueFormatter: (value) => tiposIndex.get(value as string) ?? (value as string),
      },
      {
        field: 'modalidade_execucao',
        headerName: 'Modalidade',
        flex: 1,
      },
      {
        field: 'quantitativo_maximo',
        headerName: 'Qtd. Máxima',
        flex: 1,
      },
      {
        field: 'data_inicio',
        headerName: 'Início',
        flex: 1,
        valueFormatter: (value) => new Date(value).toLocaleDateString('pt-BR'),
      },
      {
        field: 'data_fim',
        headerName: 'Fim',
        flex: 1,
        valueFormatter: (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : '-'),
      },
      { field: 'status', headerName: 'Status', flex: 1 },
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
    [empresasIndex, tiposIndex, onDelete, onEdit, theme.vars.palette.error.main]
  );

  return { columns };
};
