import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const validacoesSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  status: parseAsStringEnum(['', 'PENDENTE', 'APROVADO', 'REPROVADO', 'ALERTA']).withDefault(''),
  motivo_rejeicao: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(25),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc'),
};

export const validacoesSearchQueryUrlKeys: UrlKeys<typeof validacoesSearchQueryParsers> = {
  search: 'q',
  status: 'st',
  motivo_rejeicao: 'mr',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const validacoesSearchQuerySerializer = createSerializer(validacoesSearchQueryParsers, {
  urlKeys: validacoesSearchQueryUrlKeys,
});

export const useValidacoesSearchParams = () =>
  useQueryStates(validacoesSearchQueryParsers, {
    urlKeys: validacoesSearchQueryUrlKeys,
  });
