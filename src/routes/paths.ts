// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DETENTOS: '/reeducandos',
  UNIDADES_PRISIONAIS: '/unidades-prisionais',
  SECRETARIAS: '/secretarias',
  EMPRESAS: '/empresas',
  EMPRESA_CONVENIOS: '/empresa-convenios',
  REGIONAIS: '/regionais',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SETTINGS: '/configuracoes',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
    },
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  detentos: {
    root: ROOTS.DETENTOS,
    detalhes: (detentoId: string) => `${ROOTS.DETENTOS}/detalhes/${detentoId}`,
  },
  unidadesPrisionais: {
    root: ROOTS.UNIDADES_PRISIONAIS,
  },
  secretarias: {
    root: ROOTS.SECRETARIAS,
  },
  empresas: {
    root: ROOTS.EMPRESAS,
  },
  empresaConvenios: {
    root: ROOTS.EMPRESA_CONVENIOS,
  },
  profissoes: {
    root: '/profissoes',
  },
  regionais: {
    root: ROOTS.REGIONAIS,
  },
  users: {
    root: ROOTS.USERS,
  },
  permissions: {
    root: '/permissions',
  },
  settings: {
    root: ROOTS.SETTINGS,
  },
  fichaCadastral: {
    root: '/ficha-cadastral',
  },
};
