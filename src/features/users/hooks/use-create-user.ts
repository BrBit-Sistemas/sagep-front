import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError, extractFieldErrors } from 'src/utils/handle-error';

import { userService } from 'src/features/users/data';

import { userKeys } from './keys';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error) => {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors.length > 0) {
        // Return field errors to be handled by the form
        throw { fieldErrors, originalError: error };
      }
      toast.error(handleError(error));
    },
  });
};
