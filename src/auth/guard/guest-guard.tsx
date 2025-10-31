import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const { loading, authenticated } = useAuthContext();
  const location = useLocation();

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (authenticated) {
      const params = new URLSearchParams(location.search);
      const returnTo = params.get('returnTo');
      const target = returnTo && returnTo.startsWith('/') ? returnTo : CONFIG.auth.redirectPath;
      window.location.href = target;
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
