import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      toast.error(`Ocorreu um erro: ${error.message}`);
    },
  });
};
