import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getEmpresas, type PaginateEmpresaDto } from 'src/api/empresas/empresas';

type Option = { label: string; value: string };

export const useEmpresasOptions = (search: string) => {
  const { findAll } = getEmpresas();
  const { data } = useQuery<PaginateEmpresaDto>({
    queryKey: ['empresas', search ?? ''],
    queryFn: () => findAll({ page: 0, limit: 100, search }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const options: Option[] = useMemo(
    () =>
      (data?.items || []).map((e) => ({
        label: e.razao_social,
        value: e.empresa_id,
      })),
    [data?.items],
  );

  const indexMap = useMemo(() => new Map(options.map((o) => [o.value, o.label])), [options]);

  return { options, indexMap };
};

