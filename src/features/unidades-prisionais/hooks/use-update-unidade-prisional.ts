import type { UpdateUnidadePrisionalSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { unidadePrisionalKeys } from './keys';
import { unidadePrisionalService } from '../data';

export const useUpdateUnidadePrisional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateUnidadePrisionalSchema) =>
      unidadePrisionalService.update(id, data),
    onSuccess: () => toast.success('Unidade Prisional atualizada com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: unidadePrisionalKeys.all }),
  });
};
