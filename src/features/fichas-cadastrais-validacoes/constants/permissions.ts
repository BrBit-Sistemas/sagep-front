/**
 * Permissões da tela de Validação de Fichas.
 *
 * Back-end reaproveita o catálogo existente — não inventamos novos subjects.
 * Endpoints de leitura aceitam `read:ficha_cadastral_interno` OU `read:ficha_cadastral_externo`.
 * Transições de status (`POST /:id/status/*`) exigem `update:ficha_cadastral_interno`.
 */

export const validacoesPermissions = {
  /** Acesso de leitura à tela — interno ou externo basta. */
  read: [
    { action: 'read', subject: 'ficha_cadastral_interno' } as const,
    { action: 'read', subject: 'ficha_cadastral_externo' } as const,
  ],
  /** Todas as ações de validação (aprovar/requerer-correcao/iniciar-analise/fila-disponivel). */
  validar: { action: 'update', subject: 'ficha_cadastral_interno' } as const,
} as const;

/** Strings `action:subject` pra `allowedRoles` do nav. */
export const validacoesAllowedRoles = {
  read: ['read:ficha_cadastral_interno', 'read:ficha_cadastral_externo'],
} as const;
