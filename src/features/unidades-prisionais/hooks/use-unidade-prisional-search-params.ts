import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const unidadePrisionalSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  nome: parseAsString.withDefault(''),
  regional: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const unidadePrisionalSearchQueryUrlKeys: UrlKeys<
  typeof unidadePrisionalSearchQueryParsers
> = {
  search: 'q',
  nome: 'n',
  regional: 'r',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const unidadePrisionalSearchQuerySerializer = createSerializer(
  unidadePrisionalSearchQueryParsers,
  {
    urlKeys: unidadePrisionalSearchQueryUrlKeys,
  }
);

export const useUnidadePrisionalSearchParams = () =>
  useQueryStates(unidadePrisionalSearchQueryParsers, {
    urlKeys: unidadePrisionalSearchQueryUrlKeys,
  });
