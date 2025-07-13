import type { CreateRegionalDto } from 'src/api/generated';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { regionalKeys } from './keys';
import { regionalService } from '../data';

export const useCreateRegional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegionalDto) => regionalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionalKeys.all });
      toast.success('Regional criada com sucesso');
    },
    onError: (error) => toast.error(handleError(error)),
  });
};
