import type { CrudService } from 'src/types';
import type { UserListParams } from 'src/features/users/types';
import type { ReadUsuarioDto } from 'src/api/generated.schemas';
import type { CreateUserSchema, UpdateUserSchema } from 'src/features/users/schemas';

import { customInstance } from 'src/lib/axios';
import { getUsuários } from 'src/api/usuários/usuários';

const api = getUsuários();

// Helper function to invalidate user cache
async function invalidateUserCache(userId: string) {
  if (typeof window !== 'undefined' && window.queryClient) {
    console.log('Invalidating user cache for:', userId);
    // Invalidar cache do usuário atual
    window.queryClient.invalidateQueries({ queryKey: ['me'] });
    // Invalidar cache da lista de usuários
    window.queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    // Invalidar cache específico do usuário
    window.queryClient.invalidateQueries({ queryKey: ['usuario', userId] });
    
    // Forçar refetch imediato e agressivo
    await window.queryClient.refetchQueries({ queryKey: ['me'] });
    
    // Aguardar um pouco e forçar novamente para garantir propagação
    setTimeout(() => {
      window.queryClient?.refetchQueries({ queryKey: ['me'] });
    }, 100);
    
    console.log('User cache invalidated and refetched for:', userId);
  }
}

// Helper function to upload avatar
async function uploadAvatar(userId: string, avatarFile: File): Promise<ReadUsuarioDto> {
  const formData = new FormData();
  formData.append('file', avatarFile);

  const result = await customInstance<ReadUsuarioDto>({
    url: `/usuarios/${userId}/avatar`,
    method: 'PUT',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });
  
  // Invalidar cache para atualizar avatar em todos os lugares
  invalidateUserCache(userId);
  
  return result;
}

export const userService: CrudService<
  ReadUsuarioDto,
  CreateUserSchema,
  UpdateUserSchema,
  UserListParams
> = {
  paginate: async ({ page, limit, search, nome, email, sort, order }: any) => {
    // Converter página de 1-based (frontend) para 0-based (backend)
    const backendPage = page - 1;
    
    const res = await api.paginate({ page: backendPage, limit, search, nome, email, sort, order });
    return {
      items: res.items,
      page: Number(res.page) + 1, // Converter de volta para 1-based para o frontend
      limit: res.limit,
      total: res.total,
      totalPages: Math.ceil((res.total ?? 0) / (res.limit || 1)) || 0,
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
    } as const;
  },
  read: (id: string) => api.findOne(id),
  create: async (data: CreateUserSchema & { avatarFile?: File | null }) => {
    const payload = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      senha: data.senha,
      secretariaId: data.secretariaId ?? '',
      regionalId: data.regionalId ?? '',
      unidadeId: data.unidadeId ?? '',
    };
    
    const createdUser = await api.create(payload);
    
    // Upload avatar if provided
    if (data.avatarFile) {
      return uploadAvatar(createdUser.id!, data.avatarFile);
    }
    
    return createdUser;
  },
  update: async (id: string, data: UpdateUserSchema & { avatarFile?: File | null }) => {
    const payload: Record<string, unknown> = {};
    if (typeof data.nome !== 'undefined') payload.nome = data.nome;
    if (typeof data.cpf !== 'undefined') payload.cpf = data.cpf;
    if (typeof data.email !== 'undefined') payload.email = data.email;
    if (typeof data.senha !== 'undefined' && data.senha !== '') payload.senha = data.senha;
    if (typeof data.secretariaId !== 'undefined') payload.secretariaId = data.secretariaId;
    if (typeof data.regionalId !== 'undefined') payload.regionalId = data.regionalId;
    if (typeof data.unidadeId !== 'undefined') payload.unidadeId = data.unidadeId;
    
    const updatedUser = await api.update(id, payload as UpdateUserSchema);
    
    // Upload avatar if provided
    if (data.avatarFile) {
      return uploadAvatar(id, data.avatarFile);
    }
    
    return updatedUser;
  },
  delete: (id: string) => api.remove(id),
};
