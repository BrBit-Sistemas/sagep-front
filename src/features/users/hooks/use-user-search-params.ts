import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const userSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const userSearchQueryUrlKeys: UrlKeys<typeof userSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const userSearchQuerySerializer = createSerializer(userSearchQueryParsers, {
  urlKeys: userSearchQueryUrlKeys,
});

export const useUserSearchParams = () =>
  useQueryStates(userSearchQueryParsers, {
    urlKeys: userSearchQueryUrlKeys,
  });
