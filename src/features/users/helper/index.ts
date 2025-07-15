import type { UpdateUserSchema } from '../schemas';
import type { User } from 'src/features/users/types';

export const userToFormValues = (user: User): UpdateUserSchema => ({
  id: user.id || '',
  nome: user.nome || '',
  email: user.email || '',
  avatarUrl: null,
  senha: '',
  confirmarSenha: '',
  regionalId: user.regional?.id || '',
  secretariaId: user.secretaria?.id || '',
  unidadeId: user.unidade?.id || '',
});
