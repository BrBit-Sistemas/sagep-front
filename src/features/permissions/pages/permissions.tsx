import type { ReadUsuarioDto } from 'src/api/generated.schemas';
import type { RoleDto, PermissionDto } from 'src/api/permissions/permissions';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  Stack,
  Avatar,
  Button,
  Divider,
  Tooltip,
  Checkbox,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  CardActions,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { getUsuários } from 'src/api/usuários/usuários';
import { DashboardContent } from 'src/layouts/dashboard';
import { getPermissionsApi } from 'src/api/permissions/permissions';
import { getAutenticação } from 'src/api/autenticação/autenticação';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const permsApi = getPermissionsApi();
const usersApi = getUsuários();
const authApi = getAutenticação();

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<ReadUsuarioDto | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [permQuery, setPermQuery] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', { page: 0, limit: 100 }],
    queryFn: () => usersApi.paginate({ page: 0, limit: 100 }).then((r) => r),
  });

  const { data: rolesPage } = useQuery({
    queryKey: ['roles', { page: 0, limit: 100 }],
    queryFn: () => permsApi.paginateRoles({ page: 0, limit: 100 }).then((r) => r),
  });

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permsApi.listPermissions().then((r) => r),
  });

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me().then((r) => r),
  });

  const roles: RoleDto[] = rolesPage?.items ?? [];
  const userItems: ReadUsuarioDto[] = users?.items ?? [];

  useEffect(() => {
    if (selectedUser?.id) {
      usersApi.findOne(selectedUser.id).then((r) => setSelectedUser(r));
    }
  }, [selectedUser?.id]);

  const createRoleMutation = useMutation({
    mutationFn: async () =>
      permsApi
        .createRole({ nome: roleName, descricao: roleDesc, permissionIds: selectedPermissionIds })
        .then((r) => r),
    onSuccess: async () => {
      setRoleName('');
      setRoleDesc('');
      setSelectedPermissionIds([]);
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const onTogglePermission = (id: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const onTogglePermissionGroup = (subject: string, ids: string[]) => {
    const groupSelected = ids.every((id) => selectedPermissionIds.includes(id));
    if (groupSelected) {
      setSelectedPermissionIds((prev) => prev.filter((p) => !ids.includes(p)));
    } else {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const groupedPermissions = (permissions ?? []).reduce(
    (acc: Record<string, PermissionDto[]>, p: PermissionDto) => {
      if (
        permQuery &&
        !(
          `${p.subject}`.toLowerCase().includes(permQuery.toLowerCase()) ||
          `${p.action}`.toLowerCase().includes(permQuery.toLowerCase())
        )
      ) {
        return acc;
      }
      acc[p.subject] = acc[p.subject] || [];
      acc[p.subject].push(p);
      return acc;
    },
    {}
  );

  const filteredUsers: ReadUsuarioDto[] = (userItems || []).filter((u) => {
    if (!userQuery) return true;
    const name = (u as any).nome || '';
    const email = (u as any).email || '';
    return `${name} ${email}`.toLowerCase().includes(userQuery.toLowerCase());
  });

  const onAssignRolesToUser = async (user: ReadUsuarioDto, roleIds: string[]) => {
    await permsApi.updateUserRoles(user.id, roleIds);
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    setSelectedUser(await usersApi.findOne(user.id).then((r) => r));
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Permissões"
        links={[{ name: 'Configurações' }, { name: 'Permissões', href: paths.permissions.root }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader title="Usuários" subheader="Selecione um usuário para gerenciar papéis" />
            <CardContent>
              <TextField
                fullWidth
                placeholder="Buscar usuário por nome ou e-mail"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" width={18} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Stack spacing={1.5}>
                {filteredUsers.map((u) => {
                  const isActive = selectedUser?.id === u.id;
                  return (
                    <Paper
                      key={u.id}
                      variant={isActive ? 'elevation' : 'outlined'}
                      sx={{
                        p: 1.25,
                        borderRadius: 1.5,
                        bgcolor: isActive
                          ? (theme) => alpha(theme.palette.primary.main, 0.04)
                          : 'transparent',
                        borderColor: isActive ? 'primary.light' : 'divider',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedUser(u)}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {(u as any).nome?.[0] ?? 'U'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {(u as any).nome}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {(u as any).email}
                          </Typography>
                        </Box>
                        {isActive && <Chip size="small" color="primary" label="Selecionado" />}
                      </Stack>
                      {isActive && (
                        <Box sx={{ mt: 1.25 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                              Papéis
                            </Typography>
                            <Tooltip
                              title={
                                currentUser?.id === u.id && (currentUser as any)?.isAdmin
                                  ? 'Não é permitido alterar suas próprias permissões (admin)'
                                  : 'Remover todos os papéis'
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={
                                    currentUser?.id === u.id && (currentUser as any)?.isAdmin
                                  }
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await onAssignRolesToUser(u, []);
                                  }}
                                >
                                  <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {roles.map((r) => {
                              const currentIds = new Set(
                                Array.isArray((selectedUser as any)?.roles)
                                  ? (selectedUser as any).roles.map((x: any) =>
                                      typeof x === 'string' ? x : x?.id
                                    )
                                  : []
                              );
                              const has = currentIds.has(r.id);
                              return (
                                <Chip
                                  key={r.id}
                                  size="small"
                                  color={has ? 'primary' : 'default'}
                                  variant={has ? 'filled' : 'outlined'}
                                  label={r.nome}
                                  disabled={
                                    currentUser?.id === u.id && (currentUser as any)?.isAdmin
                                  }
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const current = new Set(currentIds);
                                    if (has) current.delete(r.id);
                                    else current.add(r.id);
                                    await onAssignRolesToUser(u, Array.from(current) as string[]);
                                  }}
                                />
                              );
                            })}
                          </Stack>
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardHeader title="Criar Papel" subheader="Defina o nome, descrição e permissões" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  Permissões
                </Typography>
                <TextField
                  size="small"
                  placeholder="Buscar por ação ou assunto"
                  value={permQuery}
                  onChange={(e) => setPermQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" width={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Stack spacing={1.5}>
                {Object.entries(groupedPermissions).map(([subject, list]) => {
                  const ids = list.map((p) => p.id);
                  const allSelected = ids.every((id) => selectedPermissionIds.includes(id));
                  const someSelected =
                    !allSelected && ids.some((id) => selectedPermissionIds.includes(id));
                  return (
                    <Paper key={subject} variant="outlined" sx={{ p: 1.25, borderRadius: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected}
                          onChange={() => onTogglePermissionGroup(subject, ids)}
                        />
                        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                          {subject}
                        </Typography>
                        {allSelected ? (
                          <Tooltip title="Desmarcar grupo">
                            <IconButton
                              size="small"
                              onClick={() => onTogglePermissionGroup(subject, ids)}
                            >
                              <Iconify icon="solar:close-circle-bold" width={18} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Selecionar grupo">
                            <IconButton
                              size="small"
                              onClick={() => onTogglePermissionGroup(subject, ids)}
                            >
                              <Iconify icon="solar:check-circle-bold" width={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                      <Grid container spacing={1}>
                        {list.map((p) => (
                          <Grid key={p.id} size={{ xs: 12, sm: 6 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Checkbox
                                checked={selectedPermissionIds.includes(p.id)}
                                onChange={() => onTogglePermission(p.id)}
                              />
                              <Typography variant="body2">
                                {p.action}:{p.subject}
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                onClick={() => createRoleMutation.mutate()}
                disabled={!roleName || !roleDesc || selectedPermissionIds.length === 0}
              >
                Criar Papel
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setRoleName('');
                  setRoleDesc('');
                  setSelectedPermissionIds([]);
                  setPermQuery('');
                }}
              >
                Limpar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
