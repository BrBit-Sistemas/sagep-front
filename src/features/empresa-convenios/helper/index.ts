import type { EmpresaConvenio } from '../types';
import type { CreateEmpresaConvenioSchema } from '../schemas';

export const empresaConvenioToFormValues = (x: EmpresaConvenio): CreateEmpresaConvenioSchema => ({
  empresa_id: x.empresa_id,
  tipo_codigo: x.tipo_codigo,
  modalidade_execucao: x.modalidade_execucao,
  regimes_permitidos: (x.regimes_permitidos ?? []).map(String) as unknown as number[],
  artigos_vedados: (x.artigos_vedados ?? []).map(String) as unknown as number[],
  quantitativos_profissoes:
    (x.quantitativos_profissoes ?? []).map((q) => ({
      profissao_id: q.profissao_id,
      quantidade: q.quantidade,
      escolaridade_minima: q.escolaridade_minima ?? undefined,
    })),
  locais_execucao: (x.locais_execucao ?? []).map((local) => ({
    local_id: local.local_id,
    logradouro: local.logradouro,
    numero: local.numero ?? '',
    complemento: local.complemento ?? '',
    bairro: local.bairro ?? '',
    cidade: local.cidade,
    estado: local.estado,
    cep: local.cep ?? '',
    referencia: local.referencia ?? '',
  })),
  data_inicio: x.data_inicio,
  data_fim: x.data_fim ?? null,
  status: x.status,
  observacoes: x.observacoes ?? '',
});
