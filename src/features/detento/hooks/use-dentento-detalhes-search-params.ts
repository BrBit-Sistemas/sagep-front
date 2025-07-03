import { type UrlKeys, useQueryStates, createSerializer, parseAsStringEnum } from 'nuqs';

export const detentoDetalhesSearchQueryParsers = {
  tab: parseAsStringEnum(['detalhes', 'ficha_cadastral']).withDefault('ficha_cadastral'),
};

export const detentoDetalhesSearchQueryUrlKeys: UrlKeys<typeof detentoDetalhesSearchQueryParsers> =
  { tab: 't' };

export const detentoDetalhesSearchQuerySerializer = createSerializer(
  detentoDetalhesSearchQueryParsers,
  { urlKeys: detentoDetalhesSearchQueryUrlKeys }
);

export const useDetentoDetalhesSearchParams = () =>
  useQueryStates(detentoDetalhesSearchQueryParsers, {
    urlKeys: detentoDetalhesSearchQueryUrlKeys,
  });
