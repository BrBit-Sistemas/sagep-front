import type { CreateEmpresaSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { empresaKeys } from './keys';
import { empresaService } from '../data';

export const useCreateEmpresa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmpresaSchema) => empresaService.create(data),
    onSuccess: () => toast.success('Empresa criada com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: empresaKeys.all }),
  });
};
