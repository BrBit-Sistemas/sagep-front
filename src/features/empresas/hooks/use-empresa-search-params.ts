import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const empresaSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const empresaSearchQueryUrlKeys: UrlKeys<typeof empresaSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const empresaSearchQuerySerializer = createSerializer(empresaSearchQueryParsers, {
  urlKeys: empresaSearchQueryUrlKeys,
});

export const useEmpresaSearchParams = () =>
  useQueryStates(empresaSearchQueryParsers, {
    urlKeys: empresaSearchQueryUrlKeys,
  });
