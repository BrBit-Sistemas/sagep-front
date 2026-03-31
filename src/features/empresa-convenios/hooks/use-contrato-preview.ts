import { useQuery, queryOptions } from '@tanstack/react-query';

import { getEmpresaConvenios } from 'src/api/empresa-convenios/empresa-convenios';

import { empresaConvenioKeys } from './keys';

export const contratoPreviewQueryOptions = (convenioId: string) =>
  queryOptions({
    queryKey: empresaConvenioKeys.contratoPreview(convenioId),
    queryFn: () => getEmpresaConvenios().getContratoPreview(convenioId),
  });

export const useContratoPreview = (convenioId: string | undefined) =>
  useQuery({
    ...contratoPreviewQueryOptions(convenioId!),
    enabled: !!convenioId,
  });
