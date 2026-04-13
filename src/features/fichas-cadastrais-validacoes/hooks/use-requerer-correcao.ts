import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

type Payload = { fichaId: string; motivo: string };

export const useRequererCorrecao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fichaId, motivo }: Payload) =>
      validacoesService.requererCorrecao(fichaId, motivo),
    onSuccess: () => toast.success('Correção requerida'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: validacoesKeys.all }),
  });
};
