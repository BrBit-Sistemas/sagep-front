import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const detentoSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const detentoSearchQueryUrlKeys: UrlKeys<typeof detentoSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const detentoSearchQuerySerializer = createSerializer(detentoSearchQueryParsers, {
  urlKeys: detentoSearchQueryUrlKeys,
});

export const useDetentoSearchParams = () =>
  useQueryStates(detentoSearchQueryParsers, {
    urlKeys: detentoSearchQueryUrlKeys,
  });
