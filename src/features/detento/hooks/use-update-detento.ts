import type { UpdateDetentoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const useUpdateDetento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDetentoSchema) => detentoService.update(data.detentoId, data),
    onSuccess: () => toast.success('Detento atualizado com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: detentoKeys.all }),
  });
};
