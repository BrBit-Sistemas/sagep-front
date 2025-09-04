import type { CreateEmpresaConvenioSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { empresaConvenioKeys } from './keys';
import { empresaConvenioService } from '../data';

export const useCreateEmpresaConvenio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmpresaConvenioSchema) => empresaConvenioService.create(data),
    onSuccess: () => toast.success('Convênio criado com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: empresaConvenioKeys.all }),
  });
};

