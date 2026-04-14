import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  parseAsStringEnum,
} from 'nuqs';

export const fichasCadastraisSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  status_validacao: parseAsStringEnum([
    '',
    'AGUARDANDO_VALIDACAO',
    'VALIDADO',
    'REQUER_CORRECAO',
    'FILA_DISPONIVEL',
  ]).withDefault(''),
  cpf: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc'),
};

export const fichasCadastraisSearchQueryUrlKeys: UrlKeys<
  typeof fichasCadastraisSearchQueryParsers
> = {
  search: 'q',
  status_validacao: 'st',
  cpf: 'cpf',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const useFichasCadastraisSearchParams = () =>
  useQueryStates(fichasCadastraisSearchQueryParsers, {
    urlKeys: fichasCadastraisSearchQueryUrlKeys,
  });
