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
const UnidadePrisionalCadastroPage = lazy(
  () => import('src/features/unidades-prisionais/pages/cadastro')
);
const EmpresaCadastroPage = lazy(() => import('src/features/empresas/pages/cadastro'));
const ProfissaoCadastroPage = lazy(() => import('src/features/profissoes/pages/cadastro'));
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
        element: <DetentoCadastroPage />,
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
    ],
  },
];
