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

// Novo hook para Autocomplete assíncrono por nome, com debounce inteligente e mínimo de caracteres
export const useProfissoesAutocomplete = (searchText: string, minChars: number = 3) => {
  const api = getProfissoes();
  const [debounced, setDebounced] = useState(searchText);
  const debounceRef = useRef<number | null>(null);
  const lastSearchRef = useRef<string>('');

  // Debounce inteligente: busca imediatamente se o texto for mais longo que o anterior
  // ou aguarda 200ms se for mais curto (usuário deletando)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    
    const currentLength = searchText.trim().length;
    const lastLength = lastSearchRef.current.trim().length;
    
    // Se está digitando (texto ficou maior) e tem pelo menos minChars, busca imediatamente
    if (currentLength >= minChars && currentLength > lastLength) {
      setDebounced(searchText);
      lastSearchRef.current = searchText;
    } else {
      // Se está deletando ou texto é muito curto, usa debounce normal (200ms)
      debounceRef.current = window.setTimeout(() => {
        setDebounced(searchText);
        lastSearchRef.current = searchText;
      }, 200);
    }
    
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchText, minChars]);

  const enabled = (debounced?.trim().length || 0) >= minChars;

  const { data, isLoading, isFetching } = useQuery<PaginateProfissaoDto>({
    queryKey: ['profissoes-autocomplete', debounced],
    queryFn: () => api.findAll({ page: 0, limit: 20, search: debounced }),
    enabled,
    refetchOnWindowFocus: false,
    // Adiciona cache mais agressivo para melhorar performance
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  const items: ReadProfissaoDto[] = enabled ? data?.items ?? [] : [];
  const options = useMemo(() => items.map((p) => ({ id: p.id, nome: p.nome })), [items]);

  return {
    options,
    loading: isLoading || isFetching,
    hasMinimum: enabled,
  } as const;
};
