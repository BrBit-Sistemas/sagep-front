import { useQuery } from '@tanstack/react-query';

import { getTrabalhoPenalCatalog } from 'src/api/trabalho-penal/trabalho-penal-catalog';

const catalogKeys = {
  all: ['trabalho-penal-catalog'] as const,
  modelos: () => [...catalogKeys.all, 'modelos-remuneracao'] as const,
  politicas: () => [...catalogKeys.all, 'politicas-beneficio'] as const,
};

export const useModelosRemuneracaoCatalog = () =>
  useQuery({
    queryKey: catalogKeys.modelos(),
    queryFn: () => getTrabalhoPenalCatalog().listModelosRemuneracao(),
    staleTime: 60_000,
  });

export const usePoliticasBeneficioCatalog = () =>
  useQuery({
    queryKey: catalogKeys.politicas(),
    queryFn: () => getTrabalhoPenalCatalog().listPoliticasBeneficio(),
    staleTime: 60_000,
  });
