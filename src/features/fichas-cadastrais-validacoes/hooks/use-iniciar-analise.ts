import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

/**
 * Reabre a validação — volta para AGUARDANDO_VALIDACAO.
 * Usado tanto para "iniciar análise" quanto para "revalidar" fichas já decididas.
 */
export const useIniciarAnalise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fichaId: string) => validacoesService.iniciarAnalise(fichaId),
    onSuccess: () => toast.success('Análise reaberta'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: validacoesKeys.all }),
  });
};
