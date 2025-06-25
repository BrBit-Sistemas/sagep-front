import 'src/global.css';

import { useEffect } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { usePathname } from 'src/routes/hooks';

import { themeConfig, ThemeProvider } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

import { Snackbar } from './components/snackbar';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NuqsAdapter>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <MotionLazy>
                <ProgressBar />
                <SettingsDrawer defaultSettings={defaultSettings} />
                <Snackbar />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </NuqsAdapter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
