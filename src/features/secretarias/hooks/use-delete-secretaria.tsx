import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { secretariaKeys } from './keys';
import { secretariaService } from '../data';

export const useDeleteSecretaria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (secretariaId: string) => secretariaService.delete(secretariaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: secretariaKeys.all });
      toast.success('Secretaria deletada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
