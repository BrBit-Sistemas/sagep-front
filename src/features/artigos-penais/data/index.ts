import { CONFIG } from 'src/global-config';

export type ArtigoPenal = {
  codigo: string;
  codigoFormatado: string;
  descricao: string;
  tipo: string;
  legislacao: string;
  legislacaoNome: string;
};

export async function listarArtigosPenais(): Promise<ArtigoPenal[]> {
  const res = await fetch(`${CONFIG.serverUrl}/api/artigos-penais`);
  if (!res.ok) throw new Error('Erro ao listar artigos penais');
  return res.json();
}

export async function obterArtigoPorCodigo(codigo: number | string): Promise<ArtigoPenal> {
  const res = await fetch(`${CONFIG.serverUrl}/api/artigos-penais/${codigo}`);
  if (!res.ok) throw new Error('Erro ao obter artigo penal');
  return res.json();
}


