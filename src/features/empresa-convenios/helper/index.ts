import type { EmpresaConvenio } from '../types';
import type { CreateEmpresaConvenioSchema } from '../schemas';

export const empresaConvenioToFormValues = (
  x: EmpresaConvenio
): CreateEmpresaConvenioSchema => ({
  empresa_id: x.empresa_id,
  tipo_codigo: x.tipo_codigo,
  modalidade_execucao: x.modalidade_execucao,
  regimes_permitidos: (x.regimes_permitidos ?? []).map(String) as unknown as number[],
  artigos_vedados: (x.artigos_vedados ?? []).map(String) as unknown as number[],
  quantitativo_maximo: x.quantitativo_maximo ?? null,
  data_inicio: x.data_inicio,
  data_fim: x.data_fim ?? null,
  status: x.status,
  observacoes: x.observacoes ?? '',
});
