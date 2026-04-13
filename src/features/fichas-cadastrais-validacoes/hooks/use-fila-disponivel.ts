import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

/**
 * Libera uma ficha VALIDADO para a fila (FILA_DISPONIVEL).
 * Reeducando passa a ser candidato em TelaoVagasFila.
 */
export const useFilaDisponivel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fichaId: string) => validacoesService.filaDisponivel(fichaId),
    onSuccess: () => toast.success('Ficha liberada para a fila'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: validacoesKeys.all }),
  });
};
