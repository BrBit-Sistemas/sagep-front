import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { unidadePrisionalKeys } from './keys';
import { unidadePrisionalService } from '../data';

export const useDeleteUnidadePrisional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unidadeId: string) => unidadePrisionalService.delete(unidadeId),
    onSuccess: () => toast.success('Unidade Prisional excluída com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: unidadePrisionalKeys.all }),
  });
};
