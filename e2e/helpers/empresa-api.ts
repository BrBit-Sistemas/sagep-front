import type { APIRequestContext } from '@playwright/test';

import { expect } from '@playwright/test';

import { buildEmpresaPayload } from '../fixtures/empresa-data';
import type { EmpresaPayload } from '../fixtures/empresa-data';

export type EmpresaResponse = {
  empresa_id: string;
  razao_social: string;
  cnpj: string;
  tipo: 'PRIVADA' | 'PUBLICA';
  inscricao_estadual?: string | null;
  logradouro: string;
  logradouro_numero: string;
  cep: string;
  cidade: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
};

type PaginatedResponse<T> = {
  items: T[];
  total: number;
  hasNextPage: boolean;
};

export async function createEmpresa(
  api: APIRequestContext,
  payload: EmpresaPayload
): Promise<EmpresaResponse> {
  const response = await api.post('/empresas', { data: payload });
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as EmpresaResponse;
}

/**
 * Attempts to create an empresa. Returns null on 409 (CNPJ already exists).
 * Useful for idempotent bulk creation that may re-run over existing data.
 */
export async function createEmpresaSafe(
  api: APIRequestContext,
  payload: EmpresaPayload
): Promise<EmpresaResponse | null> {
  const response = await api.post('/empresas', { data: payload });
  if (response.status() === 409) return null;
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as EmpresaResponse;
}

export async function findEmpresaByCnpj(
  api: APIRequestContext,
  cnpj: string
): Promise<EmpresaResponse | null> {
  const cleanCnpj = cnpj.replace(/\D/g, '');
  const response = await api.get('/empresas', {
    params: { page: 0, limit: 5, cnpj: cleanCnpj },
  });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as PaginatedResponse<EmpresaResponse>;
  return (
    body.items.find((e) => e.cnpj.replace(/\D/g, '') === cleanCnpj) ?? null
  );
}

export async function getEmpresaById(
  api: APIRequestContext,
  id: string
): Promise<EmpresaResponse> {
  const response = await api.get(`/empresas/${id}`);
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as EmpresaResponse;
}

export async function updateEmpresa(
  api: APIRequestContext,
  id: string,
  payload: Partial<EmpresaPayload>
): Promise<EmpresaResponse> {
  const response = await api.patch(`/empresas/${id}`, { data: payload });
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as EmpresaResponse;
}

export async function deleteEmpresaById(
  api: APIRequestContext,
  id: string
): Promise<void> {
  const response = await api.delete(`/empresas/${id}`);
  expect(response.ok()).toBeTruthy();
}

export async function getEmpresasCount(api: APIRequestContext): Promise<number> {
  const response = await api.get('/empresas', { params: { page: 0, limit: 1 } });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as PaginatedResponse<EmpresaResponse>;
  return body.total;
}

export async function ensureEmpresa(
  api: APIRequestContext,
  payload: EmpresaPayload
): Promise<EmpresaResponse> {
  const existing = await findEmpresaByCnpj(api, payload.cnpj);
  if (existing) return existing;
  return createEmpresa(api, payload);
}

/**
 * Creates many empresas concurrently in controlled batches.
 *
 * @param api              - Authenticated API context
 * @param payloads         - List of empresa payloads to create
 * @param concurrency      - Max simultaneous requests per batch (default: 100)
 * @param onBatchComplete  - Optional callback invoked after each batch with running total
 */
export async function createEmpresasBatch(
  api: APIRequestContext,
  payloads: EmpresaPayload[],
  concurrency = 100,
  onBatchComplete?: (completed: number, total: number) => void
): Promise<Array<EmpresaResponse | null>> {
  const results: Array<EmpresaResponse | null> = [];

  for (let i = 0; i < payloads.length; i += concurrency) {
    const batch = payloads.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((payload) => createEmpresaSafe(api, payload))
    );
    results.push(...batchResults);
    onBatchComplete?.(Math.min(i + concurrency, payloads.length), payloads.length);
  }

  return results;
}

/**
 * Ensures the database has at least `targetCount` empresas by creating
 * missing ones with deterministic seeds. Safe to call repeatedly — existing
 * records are skipped via 409 handling.
 *
 * @param seedPrefix  - Prefix used to build deterministic seeds (e.g. 'volume-test')
 */
export async function ensureMinimumEmpresasCount(
  api: APIRequestContext,
  targetCount: number,
  seedPrefix: string,
  concurrency = 100
): Promise<{ created: number; skipped: number; finalCount: number }> {
  const currentCount = await getEmpresasCount(api);

  if (currentCount >= targetCount) {
    return { created: 0, skipped: targetCount, finalCount: currentCount };
  }

  const needed = targetCount - currentCount;

  const payloads = Array.from({ length: needed }, (_, i) =>
    buildEmpresaPayload({ seed: `${seedPrefix}-${currentCount + i}` })
  );

  const results = await createEmpresasBatch(api, payloads, concurrency);

  const created = results.filter((r) => r !== null).length;
  const skipped = results.filter((r) => r === null).length;
  const finalCount = await getEmpresasCount(api);

  return { created, skipped, finalCount };
}
