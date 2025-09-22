import type { ReadProfissaoDto, PaginateProfissaoDto } from 'src/api/generated.schemas';

import { useQuery } from '@tanstack/react-query';
import { useRef, useMemo, useState, useEffect } from 'react';

import { getProfissoes } from 'src/api/profissoes/profissoes';

// Mantém o hook existente para casos que ainda usam pré-carregamento
export const useProfissoesOptions = (search: string) => {
  const api = getProfissoes();
  const { data, isLoading } = useQuery<PaginateProfissaoDto>({
    queryKey: ['profissoes', search ?? ''],
    queryFn: () => api.findAll({ page: 0, limit: 10, search }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];
  const ids = useMemo(() => items.map((p: any) => p.id), [items]);
  const labelMap = useMemo(() => new Map(items.map((p: any) => [p.id, p.nome])), [items]);

  return { ids, labelMap, isLoading };
};

// Novo hook para Autocomplete assíncrono por nome, com debounce e mínimo de caracteres
export const useProfissoesAutocomplete = (searchText: string, minChars: number = 3) => {
  const api = getProfissoes();
  const [debounced, setDebounced] = useState(searchText);
  const debounceRef = useRef<number | null>(null);

  // debounce simples baseado em setTimeout
  // Atualiza o valor debounced 300ms após o último input
  if (debounceRef.current) {
    // no-op, placeholder to satisfy linter about potential reassignments
  }

  // Atualiza debounce quando searchText muda
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebounced(searchText);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const enabled = (debounced?.trim().length || 0) >= minChars;

  const { data, isLoading, isFetching } = useQuery<PaginateProfissaoDto>({
    queryKey: ['profissoes-autocomplete', debounced],
    queryFn: () => api.findAll({ page: 0, limit: 20, search: debounced }),
    enabled,
    refetchOnWindowFocus: false,
  });

  const items: ReadProfissaoDto[] = enabled ? data?.items ?? [] : [];
  const options = useMemo(() => items.map((p) => ({ id: p.id, nome: p.nome })), [items]);

  return {
    options,
    loading: isLoading || isFetching,
    hasMinimum: enabled,
  } as const;
};
