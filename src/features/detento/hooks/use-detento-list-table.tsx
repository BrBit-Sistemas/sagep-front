import type { GridColDef } from '@mui/x-data-grid/models';
import type { Detento } from '../types';

import { useMemo } from 'react';

export const useDetentoListTable = () => {
  const columns: GridColDef<Detento>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 100,
      },
      {
        field: 'nome',
        headerName: 'Nome',
        width: 100,
      },
      {
        field: 'cpf',
        headerName: 'CPF',
        width: 100,
      },
    ],
    []
  );

  return { columns };
};
