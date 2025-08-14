import type { UpdateDetentoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError, extractFieldErrors } from 'src/utils/handle-error';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const useUpdateDetento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDetentoSchema) => {
      const { detentoId, ...updateData } = data;
      return detentoService.update(detentoId, updateData as any);
    },
    onSuccess: () => toast.success('Detento atualizado com sucesso'),
    onError: (error) => {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors.length > 0) {
        // Return field errors to be handled by the form
        throw { fieldErrors, originalError: error };
      }
      toast.error(handleError(error));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: detentoKeys.all }),
  });
};
