import type { CreateSecretariaSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { secretariaKeys } from './keys';
import { secretariaService } from '../data';

export const useCreateSecretaria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecretariaSchema) => secretariaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: secretariaKeys.all });
      toast.success('Secretaria criada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
