import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useMarkAsRead } from 'src/features/notificacoes/hooks/use-mark-as-read';
import { useUnreadCount } from 'src/features/notificacoes/hooks/use-unread-count';
import { useNotificacoes } from 'src/features/notificacoes/hooks/use-notificacoes';
import { useMarkAllAsRead } from 'src/features/notificacoes/hooks/use-mark-all-as-read';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { varTap, varHover, transitionTap } from 'src/components/animate';

import { NotificationItem } from './notification-item';

const TABS = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Não lidas' },
] as const;

export type NotificationsDrawerProps = IconButtonProps;

export function NotificationsDrawer({ sx, ...other }: NotificationsDrawerProps) {
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const [currentTab, setCurrentTab] = useState<'all' | 'unread'>('all');

  const { data: notificacoesData, isLoading: isLoadingNotificacoes } = useNotificacoes({
    page: 0,
    limit: 30,
  });
  const { data: unreadCountData, isLoading: isLoadingUnreadCount } = useUnreadCount();

  const { mutateAsync: markAsRead } = useMarkAsRead();
  const { mutateAsync: markAllAsRead, isPending: isMarkingAllAsRead } = useMarkAllAsRead();

  const notifications = notificacoesData?.items ?? [];
  const totalUnRead = unreadCountData?.total ?? notifications.filter((item) => !item.lida).length;

  const visibleNotifications = useMemo(() => {
    if (currentTab === 'unread') {
      return notifications.filter((item) => !item.lida);
    }

    return notifications;
  }, [currentTab, notifications]);

  const handleChangeTab = useCallback((_: React.SyntheticEvent, newValue: 'all' | 'unread') => {
    setCurrentTab(newValue);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!totalUnRead) {
      return;
    }

    await markAllAsRead();
  }, [markAllAsRead, totalUnRead]);

  const handleNotificationClick = useCallback(
    async (notificacaoId: string, lida: boolean) => {
      if (lida) {
        return;
      }

      await markAsRead(notificacaoId);
    },
    [markAsRead]
  );

  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        minHeight: 68,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notificações
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Marcar todas como lidas">
          <span>
            <IconButton
              color="primary"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
            >
              <Iconify icon="eva:done-all-fill" />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Box>
  );

  const renderTabs = () => (
    <Tabs variant="fullWidth" value={currentTab} onChange={handleChangeTab} indicatorColor="custom">
      {TABS.map((tab) => {
        const count = tab.value === 'all' ? notifications.length : totalUnRead;

        return (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label variant={(tab.value === currentTab && 'filled') || 'soft'} color="default">
                {count}
              </Label>
            }
          />
        );
      })}
    </Tabs>
  );

  const renderList = () => {
    if (isLoadingNotificacoes) {
      return (
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={28} />
        </Box>
      );
    }

    if (!visibleNotifications.length) {
      return (
        <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nenhuma notificação encontrada.
          </Typography>
        </Box>
      );
    }

    return (
      <Scrollbar>
        <Box component="ul">
          {visibleNotifications.map((notification) => (
            <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
              <NotificationItem
                notification={notification}
                onClick={(item) => handleNotificationClick(item.id, item.lida)}
              />
            </Box>
          ))}
        </Box>
      </Scrollbar>
    );
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Botão de notificações"
        onClick={onOpen}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={isLoadingUnreadCount ? 0 : totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 1, maxWidth: 420 } },
        }}
      >
        {renderHead()}
        {renderTabs()}
        {renderList()}

        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Atualização automática a cada 30 segundos.
          </Typography>
        </Box>

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large" disabled>
            Ver todas
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
