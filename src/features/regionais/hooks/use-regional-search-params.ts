import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const regionalSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  nome: parseAsString.withDefault(''),
  secretaria: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const regionalSearchQueryUrlKeys: UrlKeys<typeof regionalSearchQueryParsers> = {
  search: 'q',
  nome: 'n',
  secretaria: 's',
  page: 'p',
  limit: 'l',
  sort: 'o_s',
  order: 'o',
};

export const regionalSearchQuerySerializer = createSerializer(regionalSearchQueryParsers, {
  urlKeys: regionalSearchQueryUrlKeys,
});

export const useRegionalSearchParams = () =>
  useQueryStates(regionalSearchQueryParsers, {
    urlKeys: regionalSearchQueryUrlKeys,
  });
