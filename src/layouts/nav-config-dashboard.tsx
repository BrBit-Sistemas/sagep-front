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
      },
      {
        title: 'Unidades Prisionais',
        path: paths.unidadesPrisionais.root,
        icon: ICONS.banking,
      },
      {
        title: 'Regionais',
        path: paths.regionais.root,
        icon: ICONS.folder,
      },
      {
        title: 'Secretarias',
        path: paths.secretarias.root,
        icon: ICONS.folder,
      },
      {
        title: 'Profissões',
        path: paths.profissoes.root,
        icon: ICONS.label,
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
