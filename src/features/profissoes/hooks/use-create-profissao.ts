import type { CreateProfissaoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const useCreateProfissao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfissaoSchema) => profissaoService.create(data),
    onSuccess: () => toast.success('Profissão criada com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: profissaoKeys.all }),
  });
};
