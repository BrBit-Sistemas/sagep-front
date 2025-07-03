import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const profissaoSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const profissaoSearchQueryUrlKeys: UrlKeys<typeof profissaoSearchQueryParsers> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const profissaoSearchQuerySerializer = createSerializer(profissaoSearchQueryParsers, {
  urlKeys: profissaoSearchQueryUrlKeys,
});

export const useProfissaoSearchParams = () =>
  useQueryStates(profissaoSearchQueryParsers, {
    urlKeys: profissaoSearchQueryUrlKeys,
  });
