import type { UpdateProfissaoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const useUpdateProfissao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateProfissaoSchema) => profissaoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profissaoKeys.all });
      toast.success('Profissão atualizada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
