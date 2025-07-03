import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const useDeleteProfissao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profissaoId: string) => profissaoService.delete(profissaoId),
    onSuccess: () => toast.success('Profissão excluída com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: profissaoKeys.all }),
  });
};
