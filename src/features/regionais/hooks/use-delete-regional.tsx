import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { regionalKeys } from './keys';
import { regionalService } from '../data';

export const useDeleteRegional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (regionalId: string) => regionalService.delete(regionalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionalKeys.all });
      toast.success('Regional deletada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
