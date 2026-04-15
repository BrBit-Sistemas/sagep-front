export const fichasCadastraisPermissions = {
  read: { action: 'read', subject: 'ficha_cadastral_interno' } as const,
  create: { action: 'create', subject: 'ficha_cadastral_interno' } as const,
  update: { action: 'update', subject: 'ficha_cadastral_interno' } as const,
} as const;

export const fichasCadastraisAllowedRoles = {
  read: ['read:ficha_cadastral_interno'],
} as const;
