import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { handleError } from 'src/utils/handle-error';

import { getEmpresaConvenios } from 'src/api/empresa-convenios/empresa-convenios';

const GERAR_PDF_TOAST_ID = 'gerar-contrato-pdf';

export const useGerarContratoPdf = () =>
  useMutation({
    mutationFn: (convenioId: string) => getEmpresaConvenios().gerarContratoPdf(convenioId),
    onMutate: () => {
      toast.loading('Gerando PDF do contrato...', {
        id: GERAR_PDF_TOAST_ID,
        duration: Infinity,
      });
    },
    onSuccess: () => {
      toast.success('PDF do contrato gerado com sucesso', {
        id: GERAR_PDF_TOAST_ID,
      });
    },
    onError: (error) => {
      toast.error(handleError(error), {
        id: GERAR_PDF_TOAST_ID,
      });
    },
  });
