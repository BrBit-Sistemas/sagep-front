import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificacaoKeys } from './keys';
import { notificacaoService } from '../data';

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificacaoService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificacaoKeys.all });
    },
  });
};
