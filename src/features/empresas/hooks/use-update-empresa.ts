import type { UpdateEmpresaSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { empresaKeys } from './keys';
import { empresaService } from '../data';

export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ empresaId, ...data }: { empresaId: string } & UpdateEmpresaSchema) =>
      empresaService.update(empresaId, data),
    onSuccess: () => toast.success('Empresa atualizada com sucesso'),
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: empresaKeys.all }),
  });
};
