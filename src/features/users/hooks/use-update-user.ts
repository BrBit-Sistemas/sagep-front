import type { UpdateUserSchema } from 'src/features/users/schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError, extractFieldErrors } from 'src/utils/handle-error';

import { userService } from 'src/features/users/data';

import { userKeys } from './keys';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSchema) => userService.update(data.id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      toast.success('Usuário atualizado com sucesso!');
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
