import type { UserType, AuthState } from '../../types';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: undefined, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const res = await axios.get(endpoints.auth.me);
        const { user } = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        setState({ user: undefined, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: undefined, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const setUserValue = useCallback(
    (userUpdate: Partial<UserType> | undefined) => {
      if (!userUpdate) {
        setState({ user: undefined });
        return;
      }
      if (!state.user) return;
      setState({ user: { ...state.user, ...userUpdate } });
    },
    [setState, state.user]
  );

  const memoizedValue = useMemo(
    () => ({
      user: state?.user ?? undefined,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      setUser: setUserValue,
    }),
    [checkUserSession, setUserValue, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
