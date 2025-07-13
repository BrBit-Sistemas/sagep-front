import type { CreateUnidadePrisionalDto } from 'src/api/generated';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { unidadePrisionalKeys } from './keys';
import { unidadePrisionalService } from '../data';

export const useCreateUnidadePrisional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnidadePrisionalDto) => unidadePrisionalService.create(data),
    onSuccess: () => toast.success('Unidade Prisional criada com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: unidadePrisionalKeys.all }),
  });
};
