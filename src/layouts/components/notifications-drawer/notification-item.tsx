import type { Notificacao } from 'src/features/notificacoes/types';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { notificationIcons } from './icons';

export type NotificationItemProps = {
  notification: Notificacao;
  onClick?: (notification: Notificacao) => void;
};

const renderIcon = (type: string) => {
  if (type === 'VAGA_CONFIRMADA') return notificationIcons.order;
  if (type === 'DETENTO_MOVIMENTADO') return notificationIcons.delivery;
  if (type === 'RELATORIO_DISPONIVEL') return notificationIcons.mail;
  return notificationIcons.chat;
};

const formatTipo = (tipo: string) =>
  tipo
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const title = notification.titulo?.trim() || formatTipo(notification.tipo);

  return (
    <ListItemButton
      disableRipple
      onClick={() => onClick?.(notification)}
      sx={(theme) => ({
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        bgcolor: notification.lida ? 'transparent' : 'action.hover',
      })}
    >
      {!notification.lida && (
        <Box
          sx={{
            top: 26,
            width: 8,
            height: 8,
            right: 20,
            borderRadius: '50%',
            bgcolor: 'info.main',
            position: 'absolute',
          }}
        />
      )}

      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <SvgIcon sx={{ width: 24, height: 24 }}>{renderIcon(notification.tipo)}</SvgIcon>
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={title}
        secondary={
          <>
            <Box component="span" sx={{ display: 'block', color: 'text.secondary', mb: 0.25 }}>
              {notification.mensagem}
            </Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {fToNow(notification.createdAt)}
            </Box>
          </>
        }
        slotProps={{
          primary: {
            sx: { mb: 0.5, typography: 'subtitle2' },
          },
          secondary: {
            sx: {
              typography: 'caption',
            },
          },
        }}
      />
    </ListItemButton>
  );
}
