// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  CARCERAGEM: '/carceragem',
  CORE: '/core',
  LABORAL: '/laboral',
  DASHBOARD: '/dashboard',
  SETTINGS: '/configuracoes',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  sagepDocs: '/sagep-docs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  unauthorized: '/401',
  perfil: '/perfil',

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
    perfil: `${ROOTS.DASHBOARD}/perfil`,
  },

  settings: {
    root: ROOTS.SETTINGS,
  },

  // --------------------------------- Carceragem
  carceragem: {
    root: ROOTS.CARCERAGEM,
    reeducandos: {
      root: `${ROOTS.CARCERAGEM}/reeducandos`,
      detalhes: (detentoId: string) =>
        `${ROOTS.CARCERAGEM}/reeducandos/detalhes/${detentoId}`,
      fichaCadastralNew: (detentoId: string) =>
        `${ROOTS.CARCERAGEM}/reeducandos/detalhes/${detentoId}/ficha-cadastral/new`,
      fichaCadastralEdit: (detentoId: string, fichaCadastralId: string) =>
        `${ROOTS.CARCERAGEM}/reeducandos/detalhes/${detentoId}/ficha-cadastral/${fichaCadastralId}/edit`,
    },
  },

  // --------------------------------- Core
  core: {
    root: ROOTS.CORE,
    usuarios: { root: `${ROOTS.CORE}/usuarios` },
    permissoes: { root: `${ROOTS.CORE}/permissoes` },
    unidadesPrisionais: { root: `${ROOTS.CORE}/unidades-prisionais` },
    regionais: { root: `${ROOTS.CORE}/regionais` },
    secretarias: { root: `${ROOTS.CORE}/secretarias` },
    profissoes: { root: `${ROOTS.CORE}/profissoes` },
  },

  // --------------------------------- Laboral
  laboral: {
    root: ROOTS.LABORAL,
    empresas: { root: `${ROOTS.LABORAL}/empresas` },
    convenios: {
      root: `${ROOTS.LABORAL}/convenios`,
      new: `${ROOTS.LABORAL}/convenios/new`,
      edit: (convenioId: string) => `${ROOTS.LABORAL}/convenios/${convenioId}/edit`,
      contratoPreview: (convenioId: string) =>
        `${ROOTS.LABORAL}/convenios/${convenioId}/contrato-preview`,
    },
    fichaCadastral: `${ROOTS.LABORAL}/ficha-cadastral`,
    fichasCadastraisValidacoes: `${ROOTS.LABORAL}/fichas-cadastrais-validacoes`,
    telaoVagas: `${ROOTS.LABORAL}/telao-vagas`,
  },
};
