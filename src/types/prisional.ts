/**
 * Tipos e Enums do Sistema Prisional
 * 
 * Este arquivo centraliza todas as definições relacionadas ao sistema prisional,
 * incluindo regimes, escolaridade e outras constantes utilizadas em todo o sistema.
 */

// ============================================================================
// REGIMES PRISIONAIS
// ============================================================================

export enum Regime {
  FECHADO = 'FECHADO',
  SEMIABERTO = 'SEMIABERTO',
  ABERTO = 'ABERTO',
  LIVRAMENTO_CONDICIONAL = 'LIVRAMENTO CONDICIONAL',
  CIME = 'CIME',
}

/**
 * Converte o enum Regime em opções para formulários
 */
export const getRegimeOptions = (): { value: Regime; label: string }[] => [
  { value: Regime.FECHADO, label: 'Fechado' },
  { value: Regime.SEMIABERTO, label: 'Semiaberto' },
  { value: Regime.ABERTO, label: 'Aberto' },
  { value: Regime.LIVRAMENTO_CONDICIONAL, label: 'Livramento Condicional' },
  { value: Regime.CIME, label: 'CIME' },
];

/**
 * Obtém o label formatado de um regime
 */
export const getRegimeLabel = (regime: Regime): string => {
  const option = getRegimeOptions().find(opt => opt.value === regime);
  return option?.label || regime;
};

// ============================================================================
// ESCOLARIDADE
// ============================================================================

export enum Escolaridade {
  NAO_ALFABETIZADO = "NÃO ALFABETIZADO",
  FUNDAMENTAL_I_INCOMPLETO = "FUNDAMENTAL I INCOMPLETO",
  FUNDAMENTAL_I_COMPLETO = "FUNDAMENTAL I COMPLETO",
  FUNDAMENTAL_II_INCOMPLETO = "FUNDAMENTAL II INCOMPLETO",
  FUNDAMENTAL_II_COMPLETO = "FUNDAMENTAL II COMPLETO",
  ENSINO_MEDIO_INCOMPLETO = "ENSINO MÉDIO INCOMPLETO",
  ENSINO_MEDIO_COMPLETO = "ENSINO MÉDIO COMPLETO",
  SUPERIOR_INCOMPLETO = "SUPERIOR INCOMPLETO",
  SUPERIOR_COMPLETO = "SUPERIOR COMPLETO",
  POS_GRADUACAO = "PÓS-GRADUAÇÃO",
  MESTRADO = "MESTRADO",
  DOUTORADO = "DOUTORADO",
  POS_DOUTORADO = "PÓS-DOUTORADO",
}

/**
 * Converte o enum Escolaridade em opções para formulários
 */
export const getEscolaridadeOptions = (): { value: Escolaridade; label: string }[] => [
  { value: Escolaridade.NAO_ALFABETIZADO, label: 'Não Alfabetizado' },
  { value: Escolaridade.FUNDAMENTAL_I_INCOMPLETO, label: 'Fundamental I Incompleto' },
  { value: Escolaridade.FUNDAMENTAL_I_COMPLETO, label: 'Fundamental I Completo' },
  { value: Escolaridade.FUNDAMENTAL_II_INCOMPLETO, label: 'Fundamental II Incompleto' },
  { value: Escolaridade.FUNDAMENTAL_II_COMPLETO, label: 'Fundamental II Completo' },
  { value: Escolaridade.ENSINO_MEDIO_INCOMPLETO, label: 'Ensino Médio Incompleto' },
  { value: Escolaridade.ENSINO_MEDIO_COMPLETO, label: 'Ensino Médio Completo' },
  { value: Escolaridade.SUPERIOR_INCOMPLETO, label: 'Superior Incompleto' },
  { value: Escolaridade.SUPERIOR_COMPLETO, label: 'Superior Completo' },
  { value: Escolaridade.POS_GRADUACAO, label: 'Pós Graduação' },
  { value: Escolaridade.MESTRADO, label: 'Mestrado' },
  { value: Escolaridade.DOUTORADO, label: 'Doutorado' },
  { value: Escolaridade.POS_DOUTORADO, label: 'Pós Doutorado' },
];

/**
 * Obtém o label formatado de uma escolaridade
 */
export const getEscolaridadeLabel = (escolaridade: Escolaridade): string => {
  const option = getEscolaridadeOptions().find(opt => opt.value === escolaridade);
  return option?.label || escolaridade;
};

// ============================================================================
// TIPOS DE CONVÊNIO
// ============================================================================

export const CONVENIO_TIPOS = [
  { codigo: 'ADM', descricao: 'Administração' },
  { codigo: 'LIM', descricao: 'Limpeza' },
  { codigo: 'CON', descricao: 'Construção Civil' },
  { codigo: 'TEC', descricao: 'Tecnologia' },
];

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Converte um array de enums em opções para MultiSelect
 */
export const enumToMultiSelectOptions = <T extends string>(
  enumObject: Record<string, T>,
  getLabel: (value: T) => string
): { value: T; label: string }[] => 
  Object.values(enumObject).map(value => ({
    value,
    label: getLabel(value),
  }));
