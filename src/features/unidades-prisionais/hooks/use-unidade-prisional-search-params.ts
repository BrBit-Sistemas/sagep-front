import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const unidadePrisionalSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const unidadePrisionalSearchQueryUrlKeys: UrlKeys<
  typeof unidadePrisionalSearchQueryParsers
> = {
  search: 'q',
  page: 'p',
  limit: 'l',
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
