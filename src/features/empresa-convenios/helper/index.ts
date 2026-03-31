import type { EmpresaConvenio } from '../types';
import type { CreateEmpresaConvenioFormValues } from '../schemas';

export const empresaConvenioToFormValues = (x: EmpresaConvenio): CreateEmpresaConvenioFormValues => ({
  empresa_id: x.empresa_id,
  modalidade_execucao: x.modalidade_execucao,
  regimes_permitidos: (x.regimes_permitidos ?? []).map((r) => String(r)),
  artigos_vedados: x.artigos_vedados ?? [],
  max_reeducandos: x.max_reeducandos ?? undefined,
  permite_variacao_quantidade: x.permite_variacao_quantidade ?? true,
  modelo_remuneracao_id: x.modelo_remuneracao_id,
  politica_beneficio_id: x.politica_beneficio_id,
  permite_bonus_produtividade: x.permite_bonus_produtividade ?? false,
  percentual_gestao: x.percentual_gestao ?? undefined,
  percentual_contrapartida: x.percentual_contrapartida ?? undefined,
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
  observacoes: x.observacoes ?? '',
});
