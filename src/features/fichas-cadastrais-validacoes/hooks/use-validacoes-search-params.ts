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
  status_validacao: parseAsStringEnum([
    '',
    'AGUARDANDO_VALIDACAO',
    'VALIDADO',
    'REQUER_CORRECAO',
    'FILA_DISPONIVEL',
  ]).withDefault(''),
  motivo_reprovacao: parseAsString.withDefault(''),
  detento_id: parseAsString.withDefault(''),
  cpf: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc'),
};

export const validacoesSearchQueryUrlKeys: UrlKeys<typeof validacoesSearchQueryParsers> = {
  search: 'q',
  status_validacao: 'st',
  motivo_reprovacao: 'mr',
  detento_id: 'did',
  cpf: 'cpf',
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
