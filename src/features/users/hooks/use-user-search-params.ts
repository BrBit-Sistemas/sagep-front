import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const userSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  nome: parseAsString.withDefault(''),
  email: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const userSearchQueryUrlKeys: UrlKeys<typeof userSearchQueryParsers> = {
  search: 'q',
  nome: 'n',
  email: 'e',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const userSearchQuerySerializer = createSerializer(userSearchQueryParsers, {
  urlKeys: userSearchQueryUrlKeys,
});

export const useUserSearchParams = () =>
  useQueryStates(userSearchQueryParsers, {
    urlKeys: userSearchQueryUrlKeys,
  });
