import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, PermissionGuard } from 'src/auth/guard';

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
const UserCadastroPage = lazy(() => import('src/features/users/pages/cadastro'));
const PermissionsPage = lazy(() => import('../../features/permissions/pages/permissions'));
const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const ConfiguracoesPage = lazy(() => import('src/features/configuracoes/pages/configuracoes'));
const FichaCadastralExternaPage = lazy(
  () => import('src/features/detento/pages/ficha-cadastral-externa')
);
const AccountProfilePage = lazy(() => import('src/sections/account/account-profile-page'));

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
        path: 'configuracoes',
        element: <ConfiguracoesPage />,
      },
      {
        path: 'dashboard/perfil',
        element: <AccountProfilePage />,
      },
      {
        path: 'perfil',
        element: <AccountProfilePage />,
      },
      {
        path: 'reeducandos',
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
        path: 'ficha-cadastral',
        element: (
          <PermissionGuard
            required={[
              { action: 'read', subject: 'ficha_cadastral_interno' },
              { action: 'read', subject: 'ficha_cadastral_externo' },
            ]}
            hasContent={false}
          >
            <FichaCadastralExternaPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'dashboard/ficha-cadastral',
        element: (
          <PermissionGuard
            required={[
              { action: 'read', subject: 'ficha_cadastral_interno' },
              { action: 'read', subject: 'ficha_cadastral_externo' },
            ]}
            hasContent={false}
          >
            <FichaCadastralExternaPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <PermissionGuard required={{ action: 'read', subject: 'usuarios' }} hasContent={false}>
            <UserCadastroPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'permissions',
        element: (
          <PermissionGuard requireAdmin hasContent={false}>
            <PermissionsPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'unidades-prisionais',
        element: (
          <PermissionGuard
            required={{ action: 'read', subject: 'unidades_prisionais' }}
            hasContent={false}
          >
            <UnidadePrisionalCadastroPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'empresas',
        element: <EmpresaCadastroPage />,
      },
      {
        path: 'profissoes',
        element: (
          <PermissionGuard required={{ action: 'read', subject: 'profissoes' }} hasContent={false}>
            <ProfissaoCadastroPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'regionais',
        element: (
          <PermissionGuard required={{ action: 'read', subject: 'regionais' }} hasContent={false}>
            <RegionalCadastroPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'secretarias',
        element: (
          <PermissionGuard required={{ action: 'read', subject: 'secretarias' }} hasContent={false}>
            <SecretariaCadastroPage />
          </PermissionGuard>
        ),
      },
    ],
  },
];
