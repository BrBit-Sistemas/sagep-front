/**
 * Permissões da feature de Validação de Fichas Cadastrais.
 *
 * Padrão do admin: `{ action, subject }` consumido por `PermissionGuard`
 * e `usePermissionCheck().hasPermission(...)`. Navegação usa a string
 * `action:subject` em `allowedRoles`.
 *
 * Back-end precisa seedar as 3 linhas no catálogo `auth_permissions`
 * (a tela /permissions lista tudo que o GET /auth/permissions devolve).
 */

export const validacoesPermissions = {
  read: { action: 'read', subject: 'ficha_cadastral_validacao' } as const,
  validar: { action: 'update', subject: 'ficha_cadastral_validacao' } as const,
  revalidar: {
    action: 'update',
    subject: 'ficha_cadastral_validacao_revalidar',
  } as const,
} as const;

/** String `action:subject` para uso em `allowedRoles` do nav. */
export const validacoesAllowedRoles = {
  read: `${validacoesPermissions.read.action}:${validacoesPermissions.read.subject}`,
  validar: `${validacoesPermissions.validar.action}:${validacoesPermissions.validar.subject}`,
  revalidar: `${validacoesPermissions.revalidar.action}:${validacoesPermissions.revalidar.subject}`,
} as const;
