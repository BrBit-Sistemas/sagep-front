import type { UpdateProfissaoSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { profissaoKeys } from './keys';
import { profissaoService } from '../data';

export const useUpdateProfissao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profissaoId, ...data }: { profissaoId: string } & UpdateProfissaoSchema) =>
      profissaoService.update(profissaoId, data),
    onSuccess: () => toast.success('Profissão atualizada com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: profissaoKeys.all }),
  });
};
