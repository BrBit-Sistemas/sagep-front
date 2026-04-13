import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

export const useAprovar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fichaId: string) => validacoesService.aprovar(fichaId),
    onSuccess: () => toast.success('Ficha aprovada'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: validacoesKeys.all }),
  });
};
