import type { NavSectionProps } from 'src/components/nav-section';

import { Chip } from '@mui/material';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { validacoesAllowedRoles } from 'src/features/fichas-cadastrais-validacoes/constants/permissions';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

/** Chip de "beta" pra sinalizar telas ainda em teste no menu lateral. */
const BetaChip = (
  <Chip
    size="small"
    label="BETA"
    color="warning"
    variant="outlined"
    sx={{
      height: 18,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.4,
      borderRadius: 0.75,
      '& .MuiChip-label': { px: 0.75 },
    }}
  />
);

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
        title: 'Reeducandos',
        path: paths.carceragem.reeducandos.root,
        icon: ICONS.user,
        allowedRoles: ['read:detentos', 'read:ficha_cadastral_interno'],
      },
    ],
  },
  {
    subheader: 'Core',
    items: [
      {
        title: 'Usuários',
        path: paths.core.usuarios.root,
        icon: ICONS.user,
        allowedRoles: ['read:usuarios'],
      },
      {
        title: 'Permissões',
        path: paths.core.permissoes.root,
        icon: ICONS.lock,
        allowedRoles: ['read:roles'],
      },
      {
        title: 'Unidades Prisionais',
        path: paths.core.unidadesPrisionais.root,
        icon: ICONS.banking,
        allowedRoles: ['read:unidades_prisionais'],
      },
      {
        title: 'Regionais',
        path: paths.core.regionais.root,
        icon: ICONS.folder,
        allowedRoles: ['read:regionais'],
      },
      {
        title: 'Secretarias',
        path: paths.core.secretarias.root,
        icon: ICONS.folder,
        allowedRoles: ['read:secretarias'],
      },
      {
        title: 'Profissões',
        path: paths.core.profissoes.root,
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
        path: paths.laboral.empresas.root,
        icon: ICONS.ecommerce,
        allowedRoles: ['read:empresas'],
      },
      {
        title: 'Convênios',
        path: paths.laboral.convenios.root,
        icon: ICONS.file,
        allowedRoles: ['read:empresas_convenio'],
      },
      {
        title: 'Ficha Cadastral',
        path: paths.laboral.fichaCadastral,
        icon: ICONS.file,
        allowedRoles: ['read:ficha_cadastral_externo'],
      },
      {
        title: 'Validação de Fichas',
        path: paths.laboral.fichasCadastraisValidacoes,
        icon: ICONS.invoice,
        info: BetaChip,
        allowedRoles: [...validacoesAllowedRoles.read],
      },
      {
        title: 'Telão de Vagas',
        path: paths.laboral.telaoVagas,
        icon: ICONS.kanban,
        info: BetaChip,
        allowedRoles: ['read:telao_vagas_fila'],
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
        allowedRoles: ['read:settings'],
      },
    ],
  },
];
