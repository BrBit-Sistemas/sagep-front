import type { EmpresaConvenio } from '../types';
import type { CreateEmpresaConvenioFormValues } from '../schemas';

const niveisOrdenados = ['I', 'II', 'III'] as const;

export const empresaConvenioToFormValues = (x: EmpresaConvenio): CreateEmpresaConvenioFormValues => {
  const mapQ = new Map(
    (x.quantidades_nivel ?? []).map((q) => [q.nivel, q.quantidade])
  );
  const quantidades_nivel = niveisOrdenados.map((n) => ({
    nivel: n,
    quantidade: mapQ.get(n) ?? 0,
  }));
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
  return {
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
    quantidades_nivel,
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

export const defaultQuantidadesNivelForm = (): CreateEmpresaConvenioFormValues['quantidades_nivel'] =>
  niveisOrdenados.map((nivel) => ({ nivel, quantidade: 0 }));
