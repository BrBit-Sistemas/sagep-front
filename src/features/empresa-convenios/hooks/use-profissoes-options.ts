import type { PaginateProfissaoDto } from 'src/api/generated.schemas';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getProfissoes } from 'src/api/profissoes/profissoes';

export const useProfissoesOptions = (search: string) => {
  const api = getProfissoes();
  const { data, isLoading } = useQuery<PaginateProfissaoDto>({
    queryKey: ['profissoes', search ?? ''],
    queryFn: () => api.findAll({ page: 0, limit: 100, search }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];
  const ids = useMemo(() => items.map((p: any) => p.id), [items]);
  const labelMap = useMemo(() => new Map(items.map((p: any) => [p.id, p.nome])), [items]);

  return { ids, labelMap, isLoading };
};
