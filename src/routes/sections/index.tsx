import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';

import { CONFIG } from 'src/global-config';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

const FichaCadastralExternaPage = lazy(
  () => import('src/features/detento/pages/ficha-cadastral-externa')
);

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

const HowToPage = lazy(() => import('src/pages/how-to-ficha-cadastral'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={CONFIG.auth.redirectPath} replace />,
  },
  {
    path: '/como-criar-ficha-cadastral',
    element: <HowToPage />,
  },

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Public external route (outside dashboard)
  { path: '/ficha-cadastral-externa', element: <FichaCadastralExternaPage /> },

  // No match
  { path: '*', element: <Page404 /> },
];
