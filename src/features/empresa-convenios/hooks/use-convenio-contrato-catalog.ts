import { useQuery } from '@tanstack/react-query';

import { getConvenioContratoCatalog } from 'src/api/empresa-convenios/convenio-contrato-catalog';

const api = getConvenioContratoCatalog();

export const convenioContratoCatalogKeys = {
  templates: ['convenio-contrato', 'templates'] as const,
  tabelas: ['convenio-contrato', 'tabelas'] as const,
};

export function useTemplateContratosCatalog() {
  return useQuery({
    queryKey: convenioContratoCatalogKeys.templates,
    queryFn: () => api.listTemplates(),
  });
}

export function useTabelasProdutividadeCatalog() {
  return useQuery({
    queryKey: convenioContratoCatalogKeys.tabelas,
    queryFn: () => api.listTabelasProdutividade(),
  });
}
