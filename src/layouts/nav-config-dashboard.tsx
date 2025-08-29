import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  settings: icon('ic-params'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'Carceragem',
    items: [
      {
        title: 'Detentos',
        path: paths.detentos.root,
        icon: ICONS.user,
        allowedRoles: ['read:detentos'],
      },
      {
        title: 'Ficha-cadastral',
        path: `${paths.dashboard.root}/ficha-cadastral`,
        icon: ICONS.file,
        allowedRoles: ['read:ficha_cadastral_interno', 'read:ficha_cadastral_externo'],
      },
    ],
  },
  {
    subheader: 'Core',
    items: [
      {
        title: 'Usuários',
        path: paths.users.root,
        icon: ICONS.user,
        allowedRoles: ['read:usuarios'],
      },
      {
        title: 'Permissões',
        path: paths.permissions.root,
        icon: ICONS.lock,
        // Admins implicitly allowed by guard; expose only to admins here
        // Using an action:subject token that only admins will have effectively
        allowedRoles: ['read:roles'],
      },
      {
        title: 'Unidades Prisionais',
        path: paths.unidadesPrisionais.root,
        icon: ICONS.banking,
        allowedRoles: ['read:unidades_prisionais'],
      },
      {
        title: 'Regionais',
        path: paths.regionais.root,
        icon: ICONS.folder,
        allowedRoles: ['read:regionais'],
      },
      {
        title: 'Secretarias',
        path: paths.secretarias.root,
        icon: ICONS.folder,
        allowedRoles: ['read:secretarias'],
      },
      {
        title: 'Profissões',
        path: paths.profissoes.root,
        icon: ICONS.label,
        allowedRoles: ['read:profissoes'],
      },
    ],
  },
  {
    subheader: 'Laboral',
    items: [
      {
        title: 'Empresas',
        path: paths.empresas.root,
        icon: ICONS.ecommerce,
      },
    ],
  },
];

export const navBottomData: NavSectionProps['data'] = [
  {
    items: [
      {
        title: 'Configurações',
        path: paths.settings.root,
        icon: ICONS.settings,
      },
    ],
  },
];
