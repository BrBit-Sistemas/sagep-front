import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificacaoKeys } from './keys';
import { notificacaoService } from '../data';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificacaoService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificacaoKeys.all });
    },
  });
};
