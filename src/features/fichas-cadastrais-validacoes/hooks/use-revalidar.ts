import type { RevalidarFichaSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

type Payload = { fichaId: string; data: RevalidarFichaSchema };

export const useRevalidar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fichaId, data }: Payload) => validacoesService.revalidar(fichaId, data),
    onSuccess: () => toast.success('Validação reaberta'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: validacoesKeys.all }),
  });
};
