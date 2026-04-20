import type { UseFormReturn } from 'react-hook-form';
import type { EmpresaConvenio } from '../types';
import type { CreateEmpresaConvenioFormValues } from '../schemas';
import type { CodigoTemplateContrato } from 'src/api/empresa-convenios/convenio-contrato-catalog';

import {
  formatCepFromStorage,
  formatTimeHmFromStorage,
  formatDocumentoBrFromStorage,
  formatPhoneBrMobileFromStorage,
} from 'src/utils/input-masks';

import { GRAUS_DESEMPENHO } from '../schemas';

const silentSet = { shouldValidate: false, shouldDirty: true } as const;

type ConvenioFormPick = Pick<UseFormReturn<CreateEmpresaConvenioFormValues>, 'setValue'>;

/**
 * Limpa campos que deixam de se aplicar ao template escolhido (evita enviar dados obsoletos ao salvar).
 * Não use setValue(..., undefined) para números opcionais: o get() interno do RHF trata undefined como
 * “ausente” e o useWatch volta a usar _defaultValues (ex.: 40 carregado na edição). null é lido como
 * valor real e o Zod trata como vazio (optionalIntMeta / optionalIntNonNeg).
 */
export function clearEmpresaConvenioFieldsHiddenByTemplate(
  codigo: CodigoTemplateContrato | undefined,
  form: ConvenioFormPick
): void {
  const { setValue } = form;
  if (codigo !== 'PADRAO_INTRAMUROS') {
    setValue('jornada_tipo', '', silentSet);
    setValue('carga_horaria_semanal', null, silentSet);
    setValue('escala', '', silentSet);
    setValue('horario_inicio', null, silentSet);
    setValue('horario_fim', null, silentSet);
  }
  if (codigo !== 'PADRAO_ORGAO_PUBLICO_GDF') {
    setValue('quantidade_nivel_i', null, silentSet);
    setValue('quantidade_nivel_ii', null, silentSet);
    setValue('quantidade_nivel_iii', null, silentSet);
  }
}

export const empresaConvenioToFormValues = (x: EmpresaConvenio): CreateEmpresaConvenioFormValues => {
  const rep = x.responsaveis?.find((r) => r.tipo === 'REPRESENTANTE_LEGAL');
  const prep = x.responsaveis?.find((r) => r.tipo === 'PREPOSTO_OPERACIONAL');
  const responsaveis: CreateEmpresaConvenioFormValues['responsaveis'] = [
    {
      tipo: 'REPRESENTANTE_LEGAL',
      nome: rep?.nome ?? '',
      cargo: rep?.cargo ?? '',
      documento: formatDocumentoBrFromStorage(rep?.documento),
      email: rep?.email ?? '',
      telefone: formatPhoneBrMobileFromStorage(rep?.telefone),
    },
    {
      tipo: 'PREPOSTO_OPERACIONAL',
      nome: prep?.nome ?? '',
      cargo: prep?.cargo ?? '',
      documento: formatDocumentoBrFromStorage(prep?.documento),
      email: prep?.email ?? '',
      telefone: formatPhoneBrMobileFromStorage(prep?.telefone),
    },
  ];
  const distribuicao_profissoes = (x.distribuicao_profissoes ?? []).map((d) => ({
    profissao_id: d.profissao_id,
    quantidade: d.quantidade,
    nivel: (d.nivel ?? '') as '' | 'I' | 'II' | 'III',
    observacao: d.observacao ?? '',
  }));
  const bonusLinhas = GRAUS_DESEMPENHO.map((g) => {
    const found = (x.bonus_produtividade_tabela_json ?? []).find(
      (row) => (row as Record<string, unknown>).grau === g.grau
    ) as Record<string, unknown> | undefined;
    return {
      grau: g.grau,
      nome: g.nome,
      percentual: g.percentual,
      nivel_i: found?.nivel_i != null ? Number(found.nivel_i) : null,
      nivel_ii: found?.nivel_ii != null ? Number(found.nivel_ii) : null,
      nivel_iii: found?.nivel_iii != null ? Number(found.nivel_iii) : null,
    };
  });
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
    bonus_produtividade_linhas: bonusLinhas,
    locais_execucao: (x.locais_execucao ?? []).map((local) => ({
      local_id: local.local_id,
      logradouro: local.logradouro,
      numero: local.numero ?? '',
      complemento: local.complemento ?? '',
      bairro: local.bairro ?? '',
      cidade: local.cidade,
      estado: local.estado,
      cep: formatCepFromStorage(local.cep),
      referencia: local.referencia ?? '',
    })),
    data_inicio: x.data_inicio,
    data_fim: x.data_fim ?? null,
    data_repactuacao: x.data_repactuacao ?? null,
    observacoes: x.observacoes ?? '',
    template_contrato_id: x.template_contrato_id,
    jornada_tipo: x.jornada_tipo ?? '',
    carga_horaria_semanal: x.carga_horaria_semanal ?? undefined,
    escala: x.escala ?? '',
    horario_inicio: formatTimeHmFromStorage(x.horario_inicio),
    horario_fim: formatTimeHmFromStorage(x.horario_fim),
    possui_seguro_acidente: x.possui_seguro_acidente ?? false,
    tipo_cobertura_seguro: x.tipo_cobertura_seguro ?? '',
    observacao_seguro: x.observacao_seguro ?? '',
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
