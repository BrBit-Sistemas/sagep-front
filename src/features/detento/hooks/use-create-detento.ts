import type { CreateDetentoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError, extractFieldErrors } from 'src/utils/handle-error';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const useCreateDetento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDetentoSchema) => detentoService.create(data),
    onSuccess: () => toast.success('Detento criado com sucesso'),
    onError: (error) => {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors.length > 0) {
        // Return field errors to be handled by the form
        throw { fieldErrors, originalError: error };
      }
      // Para erros 409 (Conflict), não mostrar toast, deixar o form tratar
      const status = (error as any)?.response?.status;
      if (status === 409) {
        throw error; // Relança o erro para o form tratar
      }
      toast.error(handleError(error));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: detentoKeys.all }),
  });
};
