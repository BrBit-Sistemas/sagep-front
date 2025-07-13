import type { UpdateSecretariaSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { secretariaKeys } from './keys';
import { secretariaService } from '../data';

export const useUpdateSecretaria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ secretariaId, ...data }: UpdateSecretariaSchema) =>
      secretariaService.update(secretariaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: secretariaKeys.all });
      toast.success('Secretaria atualizada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
