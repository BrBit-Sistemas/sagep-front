import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

const DetentoCadastroPage = lazy(() => import('src/features/detento/pages/cadastro'));
const DetentoDetalhesPage = lazy(() => import('src/features/detento/pages/detalhes'));

const UnidadePrisionalCadastroPage = lazy(
  () => import('src/features/unidades-prisionais/pages/cadastro')
);
const EmpresaCadastroPage = lazy(() => import('src/features/empresas/pages/cadastro'));
const ProfissaoCadastroPage = lazy(() => import('src/features/profissoes/pages/cadastro'));
const RegionalCadastroPage = lazy(() => import('src/features/regionais/pages/regional-cadastro'));
const SecretariaCadastroPage = lazy(
  () => import('src/features/secretarias/pages/secretaria-cadastro')
);
const IndexPage = lazy(() => import('src/pages/dashboard/one'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      {
        path: 'dashboard',
        element: <IndexPage />,
      },
      {
        path: 'detentos',
        children: [
          {
            index: true,
            element: <DetentoCadastroPage />,
          },
          {
            path: 'detalhes/:detentoId',
            element: <DetentoDetalhesPage />,
          },
        ],
      },
      {
        path: 'unidades-prisionais',
        element: <UnidadePrisionalCadastroPage />,
      },
      {
        path: 'empresas',
        element: <EmpresaCadastroPage />,
      },
      {
        path: 'profissoes',
        element: <ProfissaoCadastroPage />,
      },
      {
        path: 'regionais',
        element: <RegionalCadastroPage />,
      },
      {
        path: 'secretarias',
        element: <SecretariaCadastroPage />,
      },
    ],
  },
];
