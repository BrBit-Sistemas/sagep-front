import type { UpdateUserSchema } from 'src/features/users/schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      toast.error(`Ocorreu um erro: ${error.message}`);
    },
  });
};
