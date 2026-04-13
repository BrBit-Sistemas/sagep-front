import { z } from 'zod';

/**
 * "Reprovar / Requerer correção" — POST /:id/status/requerer-correcao
 * Back-end aceita `motivo` opcional, mas no UX fazemos obrigatório com ≥3 chars
 * pra manter histórico útil.
 */
export const requererCorrecaoSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, 'Motivo é obrigatório ao reprovar (mín. 3 caracteres).'),
});

export type RequererCorrecaoSchema = z.infer<typeof requererCorrecaoSchema>;

/**
 * "Revalidar" → reabre a análise (POST /:id/status/iniciar-analise).
 * Back-end não exige motivo. Exigimos no cliente só pra registro.
 */
export const iniciarAnaliseSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, 'Motivo da revalidação é obrigatório (mín. 3 caracteres).'),
});

export type IniciarAnaliseSchema = z.infer<typeof iniciarAnaliseSchema>;
