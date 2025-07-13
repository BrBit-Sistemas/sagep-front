import type { UpdateRegionalSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { regionalKeys } from './keys';
import { regionalService } from '../data';

export const useUpdateRegional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateRegionalSchema) => regionalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionalKeys.all });
      toast.success('Regional atualizada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
