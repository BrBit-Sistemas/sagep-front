import type { ValidarFichaSchema } from '../schemas';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { validacoesKeys } from './keys';
import { validacoesService } from '../data';

type Payload = { fichaId: string; data: ValidarFichaSchema };

export const useValidar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fichaId, data }: Payload) => validacoesService.validar(fichaId, data),
    onSuccess: (_res, vars) => {
      const label =
        vars.data.decisao === 'APROVADO'
          ? 'Ficha aprovada'
          : vars.data.decisao === 'REPROVADO'
            ? 'Ficha reprovada'
            : 'Alerta registrado';
      toast.success(label);
    },
    onError: (error) => toast.error(handleError(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: validacoesKeys.all }),
  });
};
