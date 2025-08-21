import type { Profissao } from '../types';
import type { CreateProfissaoSchema } from '../schemas';

export const profissaoToFormValues = (profissao: Profissao): CreateProfissaoSchema => ({
  nome: profissao.nome,
  descricao: profissao.descricao,
  ativo: profissao.ativo,
});
