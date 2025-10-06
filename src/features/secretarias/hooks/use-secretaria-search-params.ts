import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const secretariaSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  nome: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const secretariaSearchQueryUrlKeys: UrlKeys<typeof secretariaSearchQueryParsers> = {
  search: 'q',
  nome: 'n',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const secretariaSearchQuerySerializer = createSerializer(secretariaSearchQueryParsers, {
  urlKeys: secretariaSearchQueryUrlKeys,
});

export const useSecretariaSearchParams = () =>
  useQueryStates(secretariaSearchQueryParsers, {
    urlKeys: secretariaSearchQueryUrlKeys,
  });
