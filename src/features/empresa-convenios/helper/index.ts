import type { EmpresaConvenio } from '../types';
import type { CreateEmpresaConvenioFormValues } from '../schemas';

export const empresaConvenioToFormValues = (x: EmpresaConvenio): CreateEmpresaConvenioFormValues => {
  const rep = x.responsaveis?.find((r) => r.tipo === 'REPRESENTANTE_LEGAL');
  const prep = x.responsaveis?.find((r) => r.tipo === 'PREPOSTO_OPERACIONAL');
  const responsaveis: CreateEmpresaConvenioFormValues['responsaveis'] = [
    {
      tipo: 'REPRESENTANTE_LEGAL',
      nome: rep?.nome ?? '',
      cargo: rep?.cargo ?? '',
      documento: rep?.documento ?? '',
      email: rep?.email ?? '',
      telefone: rep?.telefone ?? '',
    },
    {
      tipo: 'PREPOSTO_OPERACIONAL',
      nome: prep?.nome ?? '',
      cargo: prep?.cargo ?? '',
      documento: prep?.documento ?? '',
      email: prep?.email ?? '',
      telefone: prep?.telefone ?? '',
    },
  ];
  const distribuicao_profissoes = (x.distribuicao_profissoes ?? []).map((d) => ({
    profissao_id: d.profissao_id,
    quantidade: d.quantidade,
    nivel: (d.nivel ?? '') as '' | 'I' | 'II' | 'III',
    observacao: d.observacao ?? '',
  }));
  const bonusRaw =
    x.bonus_produtividade_tabela_json != null
      ? JSON.stringify(x.bonus_produtividade_tabela_json, null, 2)
      : '';
  return {
    empresa_id: x.empresa_id,
    modalidade_execucao: x.modalidade_execucao,
    regimes_permitidos: (x.regimes_permitidos ?? []).map((r) => String(r)),
    artigos_vedados: x.artigos_vedados ?? [],
    max_reeducandos: x.max_reeducandos ?? undefined,
    permite_variacao_quantidade: x.permite_variacao_quantidade ?? true,
    tipo_calculo_remuneracao: x.tipo_calculo_remuneracao ?? 'MENSAL',
    usa_nivel: x.usa_nivel ?? true,
    valor_nivel_i: x.valor_nivel_i ?? undefined,
    valor_nivel_ii: x.valor_nivel_ii ?? undefined,
    valor_nivel_iii: x.valor_nivel_iii ?? undefined,
    transporte_responsavel: x.transporte_responsavel ?? 'FUNAP',
    alimentacao_responsavel: x.alimentacao_responsavel ?? 'FUNAP',
    valor_transporte: x.valor_transporte ?? 0,
    valor_alimentacao: x.valor_alimentacao ?? 0,
    beneficio_variavel_por_dia: x.beneficio_variavel_por_dia ?? true,
    observacao_beneficio: x.observacao_beneficio ?? '',
    quantidade_nivel_i: x.quantidade_nivel_i ?? undefined,
    quantidade_nivel_ii: x.quantidade_nivel_ii ?? undefined,
    quantidade_nivel_iii: x.quantidade_nivel_iii ?? undefined,
    permite_bonus_produtividade: x.permite_bonus_produtividade ?? false,
    bonus_produtividade_descricao: x.bonus_produtividade_descricao ?? '',
    bonus_produtividade_tabela_json_raw: bonusRaw,
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
    template_contrato_id: x.template_contrato_id,
    jornada_tipo: x.jornada_tipo ?? '',
    carga_horaria_semanal: x.carga_horaria_semanal ?? undefined,
    escala: x.escala ?? '',
    horario_inicio: x.horario_inicio ?? null,
    horario_fim: x.horario_fim ?? null,
    possui_seguro_acidente: x.possui_seguro_acidente ?? false,
    tipo_cobertura_seguro: x.tipo_cobertura_seguro ?? '',
    observacao_seguro: x.observacao_seguro ?? '',
    observacao_juridica: x.observacao_juridica ?? '',
    clausula_adicional: x.clausula_adicional ?? '',
    descricao_complementar_objeto: x.descricao_complementar_objeto ?? '',
    observacao_operacional: x.observacao_operacional ?? '',
    tabela_produtividade_id: x.tabela_produtividade_id ?? '',
    responsaveis,
    distribuicao_profissoes:
      distribuicao_profissoes.length > 0
        ? distribuicao_profissoes
        : [{ profissao_id: '', quantidade: 0, nivel: '', observacao: '' }],
  };
};

export const defaultResponsaveisForm = (): CreateEmpresaConvenioFormValues['responsaveis'] => [
  {
    tipo: 'REPRESENTANTE_LEGAL',
    nome: '',
    cargo: '',
    documento: '',
    email: '',
    telefone: '',
  },
  {
    tipo: 'PREPOSTO_OPERACIONAL',
    nome: '',
    cargo: '',
    documento: '',
    email: '',
    telefone: '',
  },
];

export const defaultDistribuicaoProfissoesForm = (): CreateEmpresaConvenioFormValues['distribuicao_profissoes'] => [
  { profissao_id: '', quantidade: 0, nivel: '', observacao: '' },
];
