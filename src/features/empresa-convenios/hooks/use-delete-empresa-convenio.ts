import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioService } from '../data';

export const useDeleteEmpresaConvenio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (convenioId: string) => empresaConvenioService.delete(convenioId),
    onSuccess: () => toast.success('Convênio excluído com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: empresaConvenioKeys.all }),
  });
};

