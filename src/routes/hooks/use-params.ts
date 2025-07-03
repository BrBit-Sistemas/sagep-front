import { useMemo } from 'react';
import { useParams as _useParams } from 'react-router';

// ----------------------------------------------------------------------

export function useParams<T extends Record<string, string>>() {
  const params = _useParams<T>();

  return useMemo(() => params as T, [params]);
}
