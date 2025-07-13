import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const regionalSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(0),
  limit: parseAsInteger.withDefault(10),
};

export const regionalSearchQueryUrlKeys: UrlKeys<typeof regionalSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const regionalSearchQuerySerializer = createSerializer(regionalSearchQueryParsers, {
  urlKeys: regionalSearchQueryUrlKeys,
});

export const useRegionalSearchParams = () =>
  useQueryStates(regionalSearchQueryParsers, {
    urlKeys: regionalSearchQueryUrlKeys,
  });
