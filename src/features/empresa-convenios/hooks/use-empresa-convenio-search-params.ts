import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const empresaConvenioSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  empresa_id: parseAsString.withDefault(''),
  tipo: parseAsString.withDefault(''),
  modalidade: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const empresaConvenioSearchQueryUrlKeys: UrlKeys<typeof empresaConvenioSearchQueryParsers> =
  {
    search: 'q',
    empresa_id: 'e',
    tipo: 't',
    modalidade: 'm',
    status: 's',
    page: 'p',
    limit: 'l',
    sort: 'so',
    order: 'o',
  };

export const empresaConvenioSearchQuerySerializer = createSerializer(
  empresaConvenioSearchQueryParsers,
  {
    urlKeys: empresaConvenioSearchQueryUrlKeys,
  }
);

export const useEmpresaConvenioSearchParams = () =>
  useQueryStates(empresaConvenioSearchQueryParsers, {
    urlKeys: empresaConvenioSearchQueryUrlKeys,
  });
