import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const empresaSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const empresaSearchQueryUrlKeys: UrlKeys<typeof empresaSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const empresaSearchQuerySerializer = createSerializer(empresaSearchQueryParsers, {
  urlKeys: empresaSearchQueryUrlKeys,
});

export const useEmpresaSearchParams = () =>
  useQueryStates(empresaSearchQueryParsers, {
    urlKeys: empresaSearchQueryUrlKeys,
  });
