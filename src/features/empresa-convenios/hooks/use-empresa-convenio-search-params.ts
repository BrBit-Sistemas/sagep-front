import {
  type UrlKeys,
  parseAsString,
  parseAsInteger,
  useQueryStates,
  createSerializer,
} from 'nuqs';

export const empresaConvenioSearchQueryParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const empresaConvenioSearchQueryUrlKeys: UrlKeys<
  typeof empresaConvenioSearchQueryParsers
> = {
  search: 'q',
  page: 'p',
  limit: 'l',
};

export const empresaConvenioSearchQuerySerializer = createSerializer(
  empresaConvenioSearchQueryParsers,
  {
    urlKeys: empresaConvenioSearchQueryUrlKeys,
  }
);

export const useEmpresaConvenioSearchParams = () =>
  useQueryStates(empresaConvenioSearchQueryParsers, {
    urlKeys: empresaConvenioSearchQueryUrlKeys,
  });

