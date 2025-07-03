import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { empresaKeys } from './keys';
import { empresaService } from '../data';

export const useDeleteEmpresa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (empresaId: string) => empresaService.delete(empresaId),
    onSuccess: () => toast.success('Empresa excluída com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: empresaKeys.all }),
  });
};
