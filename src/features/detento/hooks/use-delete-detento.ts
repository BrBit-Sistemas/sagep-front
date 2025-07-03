import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { detentoService } from '../data';

export const useDeleteDetento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (detentoId: string) => detentoService.delete(detentoId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['detentos'] }),
    onSuccess: () => toast.success('Detento deletado com sucesso'),
    onError: (error) => toast.error(handleError(error)),
  });
};
