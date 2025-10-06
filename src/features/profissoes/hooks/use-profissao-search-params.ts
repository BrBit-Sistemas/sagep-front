import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const profissaoSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  nome: parseAsString.withDefault(''),
  descricao: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const profissaoSearchQueryUrlKeys: UrlKeys<typeof profissaoSearchQueryParsers> = {
  search: 'q',
  nome: 'n',
  descricao: 'd',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const profissaoSearchQuerySerializer = createSerializer(profissaoSearchQueryParsers, {
  urlKeys: profissaoSearchQueryUrlKeys,
});

export const useProfissaoSearchParams = () =>
  useQueryStates(profissaoSearchQueryParsers, {
    urlKeys: profissaoSearchQueryUrlKeys,
  });
