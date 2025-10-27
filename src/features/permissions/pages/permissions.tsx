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
  Dialog,
  Divider,
  Tooltip,
  Checkbox,
  Collapse,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  CardActions,
  DialogTitle,
  CardContent,
  DialogActions,
  DialogContent,
  InputAdornment,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { getUsuários } from 'src/api/usuários/usuários';
import { DashboardContent } from 'src/layouts/dashboard';
import { getPermissionsApi } from 'src/api/permissions/permissions';
import { getAutenticação } from 'src/api/autenticação/autenticação';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const permsApi = getPermissionsApi();
const usersApi = getUsuários();
const authApi = getAutenticação();

const ACTION_LABELS: Record<string, string> = {
  read: 'visualizar',
  update: 'atualizar',
  create: 'criar',
  delete: 'deletar',
};

const getActionLabel = (action?: string) => ACTION_LABELS[action ?? ''] ?? action ?? '';

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<ReadUsuarioDto | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleDto | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
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
      toast.success('Grupo de permissões criado com sucesso!');
      setRoleName('');
      setRoleDesc('');
      setSelectedPermissionIds([]);
      setSelectedRole(null);
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao criar grupo de permissões');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRole?.id) throw new Error('Nenhum grupo selecionado');
      await permsApi.updateRole(selectedRole.id, {
        nome: roleName,
        descricao: roleDesc,
        permissionIds: selectedPermissionIds,
      });
    },
    onSuccess: async () => {
      toast.success('Grupo de permissões atualizado com sucesso!');
      setRoleName('');
      setRoleDesc('');
      setSelectedPermissionIds([]);
      setSelectedRole(null);
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao atualizar grupo de permissões');
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      await permsApi.removeRole(roleId);
    },
    onSuccess: async () => {
      toast.success('Grupo de permissões deletado com sucesso!');
      setRoleName('');
      setRoleDesc('');
      setSelectedPermissionIds([]);
      setSelectedRole(null);
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erro ao deletar grupo de permissões');
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

  const toggleGroupExpanded = (subject: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subject)) {
        newSet.delete(subject);
      } else {
        newSet.add(subject);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedGroups(new Set(Object.keys(groupedPermissions)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const groupedPermissions = (permissions ?? []).reduce(
    (acc: Record<string, PermissionDto[]>, p: PermissionDto) => {
      const actionLabel = getActionLabel(p.action);
      if (
        permQuery &&
        !(
          `${p.subject}`.toLowerCase().includes(permQuery.toLowerCase()) ||
          `${p.action}`.toLowerCase().includes(permQuery.toLowerCase()) ||
          actionLabel.toLowerCase().includes(permQuery.toLowerCase())
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
    // Restrição: o usuário não pode alterar as próprias permissões de USUÁRIOS (ler/editar)
    if (currentUser?.id === user.id) {
      const rolesById = new Map(roles.map((r) => [r.id, r]));
      const grantedPermissions = (
        roleIds.map((id) => rolesById.get(id)).filter(Boolean) as RoleDto[]
      ).flatMap((r) => r.permissions ?? []);

      const hasReadUsuarios = grantedPermissions.some(
        (p) => p.id === 'read:usuarios' || (p.action === 'read' && p.subject === 'usuarios')
      );
      const hasUpdateUsuarios = grantedPermissions.some(
        (p) => p.id === 'update:usuarios' || (p.action === 'update' && p.subject === 'usuarios')
      );

      if (!hasReadUsuarios || !hasUpdateUsuarios) {
        toast.error('Você não pode alterar suas próprias permissões de usuários (ler/editar).');
        return;
      }
    }
    try {
      await permsApi.updateUserRoles(user.id, roleIds);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUser(await usersApi.findOne(user.id).then((r) => r));
      toast.success('Permissões do usuário atualizadas com sucesso!');
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao atualizar permissões do usuário');
    }
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
            <CardHeader
              title="Usuários"
              subheader="Adicione ou retire grupos de permissões dos usuários"
            />
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
                              Grupos de permissões
                            </Typography>
                            <Tooltip title="Remover todos os grupos de permissões do usuário">
                              <span>
                                <IconButton
                                  size="small"
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
            <CardHeader
              title="Grupos de permissões"
              subheader="Crie ou edite grupos de permissões e adicione as permissões que desejar"
            />
            <CardContent>
              {roles.length > 0 && (
                <>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      Grupos existentes
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clique para editar ou no ícone de lixeira para deletar
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                    {roles.map((r) => {
                      const isSelected = selectedRole?.id === r.id;
                      return (
                        <Chip
                          key={r.id}
                          label={r.nome}
                          color={isSelected ? 'primary' : 'default'}
                          variant={isSelected ? 'filled' : 'outlined'}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedRole(null);
                              setRoleName('');
                              setRoleDesc('');
                              setSelectedPermissionIds([]);
                            } else {
                              setSelectedRole(r);
                              setRoleName(r.nome);
                              setRoleDesc(r.descricao);
                              setSelectedPermissionIds(r.permissions?.map((p) => p.id) ?? []);
                            }
                          }}
                          onDelete={() => {
                            setRoleToDelete(r);
                          }}
                          deleteIcon={
                            <Tooltip title="Deletar grupo">
                              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                            </Tooltip>
                          }
                        />
                      );
                    })}
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                </>
              )}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Nome do grupo de permissões"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Descrição"
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  Permissões ({selectedPermissionIds.length} selecionadas)
                </Typography>
                <Button size="small" onClick={expandAll} sx={{ minWidth: 'auto' }}>
                  Expandir tudo
                </Button>
                <Button size="small" onClick={collapseAll} sx={{ minWidth: 'auto' }}>
                  Colapsar tudo
                </Button>
                <TextField
                  size="small"
                  placeholder="Buscar por ação ou assunto"
                  value={permQuery}
                  onChange={(e) => setPermQuery(e.target.value)}
                  sx={{ width: 240 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" width={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1),
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.3),
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.5),
                    },
                  },
                }}
              >
                <Stack spacing={1}>
                  {Object.entries(groupedPermissions).map(([subject, list]) => {
                    const ids = list.map((p) => p.id);
                    const allSelected = ids.every((id) => selectedPermissionIds.includes(id));
                    const someSelected =
                      !allSelected && ids.some((id) => selectedPermissionIds.includes(id));
                    const isExpanded = expandedGroups.has(subject);
                    return (
                      <Paper
                        key={subject}
                        variant="outlined"
                        sx={{
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          borderColor: allSelected ? 'primary.main' : 'divider',
                          bgcolor: allSelected
                            ? (theme) => alpha(theme.palette.primary.main, 0.04)
                            : 'transparent',
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{
                            p: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.05),
                            },
                          }}
                          onClick={() => toggleGroupExpanded(subject)}
                        >
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <Iconify
                              icon={
                                isExpanded
                                  ? 'eva:arrow-ios-downward-fill'
                                  : 'eva:arrow-ios-forward-fill'
                              }
                              width={20}
                            />
                          </IconButton>
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              onTogglePermissionGroup(subject, ids);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ p: 0 }}
                          />
                          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                            {subject}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${ids.filter((id) => selectedPermissionIds.includes(id)).length}/${list.length}`}
                            color={allSelected ? 'primary' : 'default'}
                            sx={{ height: 20, minWidth: 45 }}
                          />
                          {allSelected ? (
                            <Tooltip title="Desmarcar grupo">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePermissionGroup(subject, ids);
                                }}
                                sx={{ p: 0.5 }}
                              >
                                <Iconify icon="solar:close-circle-bold" width={18} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Selecionar grupo">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePermissionGroup(subject, ids);
                                }}
                                sx={{ p: 0.5 }}
                              >
                                <Iconify icon="solar:check-circle-bold" width={18} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                        <Collapse in={isExpanded}>
                          <Divider />
                          <Box sx={{ p: 1, pt: 0.5 }}>
                            <Grid container spacing={0.5}>
                              {list.map((p) => (
                                <Grid key={p.id} size={{ xs: 12, sm: 6 }}>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.5}
                                    sx={{
                                      py: 0.25,
                                      px: 0.5,
                                      borderRadius: 1,
                                      '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.05),
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      size="small"
                                      checked={selectedPermissionIds.includes(p.id)}
                                      onChange={() => onTogglePermission(p.id)}
                                      sx={{ p: 0 }}
                                    />
                                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                      {getActionLabel(p.action)}
                                    </Typography>
                                  </Stack>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Collapse>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                onClick={() =>
                  selectedRole ? updateRoleMutation.mutate() : createRoleMutation.mutate()
                }
                disabled={!roleName || !roleDesc || selectedPermissionIds.length === 0}
              >
                {selectedRole ? 'Atualizar grupo de permissões' : 'Criar grupo de permissões'}
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setSelectedRole(null);
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

      {/* Modal de confirmação para deletar role */}
      <Dialog open={!!roleToDelete} onClose={() => setRoleToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar o grupo <strong>&quot;{roleToDelete?.nome}&quot;</strong>
            ?
            <br />
            <br />
            Esta ação não pode ser desfeita e todos os usuários que possuem este grupo perderão
            essas permissões.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleToDelete(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (roleToDelete?.id) {
                deleteRoleMutation.mutate(roleToDelete.id);
                setRoleToDelete(null);
              }
            }}
            color="error"
            variant="contained"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
