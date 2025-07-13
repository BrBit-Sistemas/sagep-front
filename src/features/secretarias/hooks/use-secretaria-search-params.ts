import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const secretariaSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(0),
  limit: parseAsInteger.withDefault(10),
};

export const secretariaSearchQueryUrlKeys: UrlKeys<typeof secretariaSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const secretariaSearchQuerySerializer = createSerializer(secretariaSearchQueryParsers, {
  urlKeys: secretariaSearchQueryUrlKeys,
});

export const useSecretariaSearchParams = () =>
  useQueryStates(secretariaSearchQueryParsers, {
    urlKeys: secretariaSearchQueryUrlKeys,
  });
