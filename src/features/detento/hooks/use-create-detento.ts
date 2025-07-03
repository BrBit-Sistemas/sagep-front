import type { CreateDetentoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { detentoKeys } from './keys';
import { detentoService } from '../data';

export const useCreateDetento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDetentoSchema) => detentoService.create(data),
    onSuccess: () => toast.success('Detento criado com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: detentoKeys.all }),
  });
};
