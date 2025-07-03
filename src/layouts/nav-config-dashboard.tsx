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
    subheader: 'Detentos',
    items: [
      {
        title: 'Cadastro',
        path: paths.detentos.root,
        icon: ICONS.user,
      },
    ],
  },
  {
    subheader: 'Unidades Prisionais',
    items: [
      {
        title: 'Cadastro',
        path: paths.unidadesPrisionais.root,
        icon: ICONS.banking,
      },
    ],
  },
  {
    subheader: 'Empresas',
    items: [
      {
        title: 'Cadastro',
        path: paths.empresas.root,
        icon: ICONS.ecommerce,
      },
    ],
  },
  {
    subheader: 'Profissões',
    items: [
      {
        title: 'Cadastro',
        path: paths.profissoes.root,
        icon: ICONS.label,
      },
    ],
  },
];
