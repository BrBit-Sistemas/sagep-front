import type { UpdateEmpresaConvenioSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioService } from '../data';

export const useUpdateEmpresaConvenio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ convenioId, ...data }: { convenioId: string } & UpdateEmpresaConvenioSchema) =>
      empresaConvenioService.update(convenioId, data),
    onSuccess: () => toast.success('Convênio atualizado com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: empresaConvenioKeys.all }),
  });
};
