import type { Breakpoint } from '@mui/material/styles';
import type { ReadUsuarioDto } from 'src/api/generated.schemas';
import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from '../core';

import { merge } from 'es-toolkit';
import { varAlpha } from 'minimal-shared/utils';
import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { iconButtonClasses } from '@mui/material/IconButton';

import { getAutenticação } from 'src/api/autenticação/autenticação';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';
import {
  type NavItemProps,
  NavSectionVertical,
  type NavSectionProps,
} from 'src/components/nav-section';

import { NavMobile } from './nav-mobile';
import { VerticalDivider } from './content';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../nav-config-account';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { AccountDrawer } from '../components/account-drawer';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
import { MainSection, layoutClasses, HeaderSection, LayoutSection } from '../core';
import { navBottomData, navData as dashboardNavData } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavSectionProps['data'];
    };
    main?: MainSectionProps;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();

  // const { user } = useAuthContext();

  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = slotProps?.nav?.data ?? dashboardNavData;

  const isNavMini = settings.state.navLayout === 'mini';
  const isNavHorizontal = settings.state.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

  const authApi = getAutenticação();
  const { data: me } = useQuery<ReadUsuarioDto>({ queryKey: ['me'], queryFn: () => authApi.me() });

  const userName = me?.nome ?? 'Usuário';
  const userSecretaria = me?.secretaria?.nome;
  const userAvatarUrl = me?.avatarUrl;
  const userInitial = userName.charAt(0).toUpperCase();

  const isAdmin = Boolean((me as any)?.isAdmin);

  const hasPermission = (token: string) => {
    const [action, subject] = token.split(':');
    if (isAdmin) return true;
    return Boolean(
      (me as any)?.roles?.some((role: any) =>
        role?.permissions?.some((perm: any) => perm?.action === action && perm?.subject === subject)
      )
    );
  };

  const canDisplayItemByRole = (allowedRoles: NavItemProps['allowedRoles']): boolean => {
    if (!allowedRoles) return false; // do not hide if no requirement
    const tokens = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const isAllowed = tokens.some((t) => hasPermission(t));
    return !isAllowed; // return true to hide when not allowed
  };

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
        sx: {
          border: `1px solid ${theme.palette.divider}`,
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: 'var(--layout-nav-bg)',
            height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
            [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
          }),
        },
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      bottomArea: isNavHorizontal ? (
        <NavHorizontal
          data={navData}
          layoutQuery={layoutQuery}
          cssVars={navVars.section}
          checkPermissions={canDisplayItemByRole}
        />
      ) : null,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile
            data={navData}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
            checkPermissions={canDisplayItemByRole}
          />

          {/** @slot Logo */}
          {isNavHorizontal && (
            <Logo
              sx={{
                display: 'none',
                [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
              }}
            />
          )}

          {/** @slot Divider */}
          {isNavHorizontal && (
            <VerticalDivider sx={{ [theme.breakpoints.up(layoutQuery)]: { display: 'flex' } }} />
          )}
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Searchbar */}
          <Searchbar data={navData} />

          {/** @slot Account drawer */}
          <AccountDrawer data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      open={open}
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      checkPermissions={canDisplayItemByRole}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
      slots={{
        topArea: isNavMini ? undefined : (
          <Box
            sx={(navTheme) => ({
              px: 3,
              pt: 2,
              pb: 2,
              color: 'var(--layout-nav-text-primary-color)',
              [navTheme.breakpoints.up(layoutQuery)]: {
                ...dashboardLayoutVars(navTheme),
                height: 'auto',
              },
            })}
          >
            <Logo sx={{ height: 56, width: 'auto', mb: 2 }} />

            {/* Linha divisória sutil após o logo */}
            <Box
              sx={{
                height: 0.008,
                bgcolor: 'var(--layout-nav-text-secondary-color)',
                opacity: 0.12,
                mb: 2,
                mt: 2,
              }}
            />

            <Box
              sx={{
                mb: 2,
                py: 1.5,
                px: 1.5,
                borderRadius: 1,
                // backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.15"%3E%3Cpath d="M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z"/%3E%3C/g%3E%3C/svg%3E")',
                backgroundImage: 'url("/imgs/5807322.jpg")',
                backgroundSize: '269px 169px',
                backgroundRepeat: 'no-repeat',
                opacity: 0.7,
                // backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={userAvatarUrl}
                  alt={userName}
                  sx={(avatarTheme) => ({
                    width: 48,
                    height: 48,
                    color: 'var(--layout-nav-text-primary-color)',
                    backgroundColor: varAlpha(avatarTheme.vars.palette.common.whiteChannel, 0.08),
                    border: `1px solid ${varAlpha(avatarTheme.vars.palette.common.whiteChannel, 0.16)}`,
                  })}
                >
                  {userInitial}
                </Avatar>
                <Stack spacing={0.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2">{userName}</Typography>
                  {userSecretaria && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'var(--layout-nav-text-primary-color)' }}
                      noWrap
                    >
                      {userSecretaria}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Box>
            {/* Linha divisória sutil antes do menu */}
            <Box
              sx={{
                height: 0.005,
                bgcolor: 'var(--layout-nav-text-secondary-color)',
                opacity: 0.12,
                mb: 3,
              }}
            />
          </Box>
        ),
        bottomArea: (
          <NavSectionVertical
            data={navBottomData}
            cssVars={navVars.section}
            checkPermissions={canDisplayItemByRole}
            sx={{ px: 0 }}
          />
        ),
      }}
    />
  );

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={isNavHorizontal ? null : renderSidebar()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
