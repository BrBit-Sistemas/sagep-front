import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
  parseAsStringEnum,
} from 'nuqs';

export const detentoSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  nome: parseAsString.withDefault(''),
  cpf: parseAsString.withDefault(''),
  status_validacao: parseAsStringEnum([
    '',
    'AGUARDANDO_VALIDACAO',
    'VALIDADO',
    'REQUER_CORRECAO',
    'FILA_DISPONIVEL',
    'SEM_FICHA',
  ]).withDefault(''),
  motivo_reprovacao: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('asc'),
};

export const detentoSearchQueryUrlKeys: UrlKeys<typeof detentoSearchQueryParsers> = {
  search: 'q',
  nome: 'n',
  cpf: 'c',
  status_validacao: 'st',
  motivo_reprovacao: 'mr',
  page: 'p',
  limit: 'l',
  sort: 's',
  order: 'o',
};

export const detentoSearchQuerySerializer = createSerializer(detentoSearchQueryParsers, {
  urlKeys: detentoSearchQueryUrlKeys,
});

export const useDetentoSearchParams = () =>
  useQueryStates(detentoSearchQueryParsers, {
    urlKeys: detentoSearchQueryUrlKeys,
  });
