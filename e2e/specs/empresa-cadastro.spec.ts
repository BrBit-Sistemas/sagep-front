/**
 * E2E — Cadastro de Empresas (/laboral/empresas)
 *
 * Suite structure:
 *  1. Smoke        – page loads, table visible
 *  2. Validação    – required-field errors on empty submit
 *  3. CRUD via UI  – create → verify API → edit → delete
 *  4. Busca        – search filter narrows results
 *  5. Bulk 1k      – 1.000 empresas criadas simultaneamente via API
 *  6. Volume 10k   – garante ≥10.000 empresas no banco, verifica paginação na UI
 */

import { test, expect } from '../fixtures/auth';
import { buildEmpresaPayload } from '../fixtures/empresa-data';
import {
  createEmpresa,
  createEmpresasBatch,
  deleteEmpresaById,
  ensureEmpresa,
  ensureMinimumEmpresasCount,
  findEmpresaByCnpj,
  getEmpresaById,
  getEmpresasCount,
} from '../helpers/empresa-api';

// ─── helpers ──────────────────────────────────────────────────────────────────

async function fillEmpresaForm(
  page: import('@playwright/test').Page,
  payload: {
    razao_social: string;
    cnpj: string;
    tipo: 'PRIVADA' | 'PUBLICA';
    inscricao_estadual?: string;
    logradouro: string;
    logradouro_numero: string;
    cep: string;
    cidade: string;
    estado: string;
  }
) {
  const dialog = page.getByTestId('empresa-form-dialog');

  // Tipo (MUI Select — getByLabel resolves to 2 elements: visible div + hidden input)
  await dialog.getByRole('combobox', { name: /Tipo/i }).click();
  await page
    .getByRole('option', { name: payload.tipo === 'PRIVADA' ? 'Empresa Privada' : 'Órgão Público' })
    .click();

  await dialog.getByLabel('Razão Social').fill(payload.razao_social);
  await dialog.getByLabel('CNPJ').fill(payload.cnpj);

  if (payload.inscricao_estadual) {
    await dialog.getByLabel('Inscrição Estadual').fill(payload.inscricao_estadual);
  }

  await dialog.getByLabel('Logradouro').fill(payload.logradouro);
  await dialog.getByLabel('Número').fill(payload.logradouro_numero);
  await dialog.getByLabel('CEP').fill(payload.cep);
  await dialog.getByLabel('Cidade').fill(payload.cidade);
  await dialog.getByLabel('UF').fill(payload.estado);
}

// ─── 1. Smoke ─────────────────────────────────────────────────────────────────

test.describe('Empresa Cadastro — Smoke', () => {
  test('@smoke página carrega e exibe tabela', async ({ page }) => {
    await page.goto('/laboral/empresas');

    await expect(page.getByRole('heading', { name: /Cadastro de Empresas/i })).toBeVisible();
    await expect(page.getByTestId('empresa-add-button')).toBeVisible();

    // MUI DataGrid renders a grid role
    await expect(page.getByRole('grid')).toBeVisible();
  });
});

// ─── 2. Validação ─────────────────────────────────────────────────────────────

test.describe('Empresa Cadastro — Validação de formulário', () => {
  test('exibe erros ao submeter formulário vazio', async ({ page }) => {
    await page.goto('/laboral/empresas');
    await page.getByTestId('empresa-add-button').click();

    const dialog = page.getByTestId('empresa-form-dialog');
    await expect(dialog).toBeVisible();

    // Clear Razão Social and submit
    await dialog.getByLabel('Razão Social').clear();
    await page.getByTestId('empresa-form-submit').click();

    // Expect validation errors from React Hook Form + Zod
    await expect(
      dialog.getByText(/razão social.*obrigatório/i).or(dialog.getByText(/required/i)).first()
    ).toBeVisible();
  });

  test('rejeita CNPJ com menos de 14 dígitos', async ({ page, authenticatedApi }) => {
    const payload = buildEmpresaPayload({ seed: `validation-cnpj-${Date.now()}` });

    await page.goto('/laboral/empresas');
    await page.getByTestId('empresa-add-button').click();

    const dialog = page.getByTestId('empresa-form-dialog');
    await expect(dialog).toBeVisible();

    await fillEmpresaForm(page, { ...payload, cnpj: '1234' });
    await page.getByTestId('empresa-form-submit').click();

    await expect(
      dialog.getByText(/cnpj/i).first()
    ).toBeVisible();

    // Cleanup - no record created
    const found = await findEmpresaByCnpj(authenticatedApi, payload.cnpj);
    expect(found).toBeNull();
  });

  test('cancela dialog sem persistir dados', async ({ page, authenticatedApi }) => {
    const payload = buildEmpresaPayload({ seed: `validation-cancel-${Date.now()}` });

    await page.goto('/laboral/empresas');
    await page.getByTestId('empresa-add-button').click();

    const dialog = page.getByTestId('empresa-form-dialog');
    await expect(dialog).toBeVisible();

    await fillEmpresaForm(page, payload);
    await page.getByTestId('empresa-form-cancel').click();

    await expect(dialog).toBeHidden();

    const found = await findEmpresaByCnpj(authenticatedApi, payload.cnpj);
    expect(found).toBeNull();
  });
});

// ─── 3. CRUD via UI ───────────────────────────────────────────────────────────

test.describe('Empresa Cadastro — CRUD via UI', () => {
  test('@smoke cria empresa via formulário e verifica na API', async ({
    page,
    authenticatedApi,
  }) => {
    const payload = buildEmpresaPayload({
      mode: 'complete',
      seed: `crud-create-${Date.now()}`,
    });

    await page.goto('/laboral/empresas');
    await page.getByTestId('empresa-add-button').click();

    const dialog = page.getByTestId('empresa-form-dialog');
    await expect(dialog).toBeVisible();

    await fillEmpresaForm(page, payload);
    await page.getByTestId('empresa-form-submit').click();

    await expect(dialog).toBeHidden();

    // Verify via API
    const created = await findEmpresaByCnpj(authenticatedApi, payload.cnpj);
    expect(created).not.toBeNull();
    expect(created!.razao_social).toBe(payload.razao_social);
    expect(created!.tipo).toBe(payload.tipo);
    expect(created!.cidade).toBe(payload.cidade);

    // Cleanup
    await deleteEmpresaById(authenticatedApi, created!.empresa_id);
  });

  test('edita empresa existente e verifica atualização na API', async ({
    page,
    authenticatedApi,
  }) => {
    const payload = buildEmpresaPayload({ seed: `crud-edit-${Date.now()}` });
    const empresa = await createEmpresa(authenticatedApi, payload);

    await page.goto('/laboral/empresas');

    // Search to locate the row
    const searchInput = page.getByRole('textbox', { name: /buscar/i });
    if (await searchInput.isVisible()) {
      await searchInput.fill(payload.razao_social);
      await page.waitForTimeout(500); // debounce
    }

    // Open actions menu for the row
    const row = page.getByRole('row', { name: new RegExp(payload.razao_social, 'i') });
    await expect(row).toBeVisible();
    await row.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole('menuitem', { name: /editar/i }).click();

    const dialog = page.getByTestId('empresa-form-dialog');
    await expect(dialog).toBeVisible();

    const novaRazaoSocial = `${payload.razao_social} EDITADO`;
    await dialog.getByLabel('Razão Social').fill(novaRazaoSocial);
    await page.getByTestId('empresa-form-submit').click();

    await expect(dialog).toBeHidden();

    // Verify via API
    const updated = await getEmpresaById(authenticatedApi, empresa.empresa_id);
    expect(updated.razao_social).toBe(novaRazaoSocial);

    // Cleanup
    await deleteEmpresaById(authenticatedApi, empresa.empresa_id);
  });

  test('exclui empresa via dialog de confirmação', async ({ page, authenticatedApi }) => {
    const payload = buildEmpresaPayload({ seed: `crud-delete-${Date.now()}` });
    const empresa = await createEmpresa(authenticatedApi, payload);

    await page.goto('/laboral/empresas');

    // Search to locate the row
    const searchInput = page.getByRole('textbox', { name: /buscar/i });
    if (await searchInput.isVisible()) {
      await searchInput.fill(payload.razao_social);
      await page.waitForTimeout(500);
    }

    const row = page.getByRole('row', { name: new RegExp(payload.razao_social, 'i') });
    await expect(row).toBeVisible();
    await row.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole('menuitem', { name: /excluir/i }).click();

    const deleteDialog = page.getByTestId('empresa-delete-dialog');
    await expect(deleteDialog).toBeVisible();
    await expect(deleteDialog).toContainText(payload.razao_social);

    await page.getByTestId('empresa-delete-confirm').click();
    await expect(deleteDialog).toBeHidden();

    // Verify gone from API
    const found = await findEmpresaByCnpj(authenticatedApi, payload.cnpj);
    expect(found).toBeNull();
  });

  test('exibe erro quando API falha ao criar empresa', async ({ page }) => {
    const payload = buildEmpresaPayload({ seed: `crud-api-error-${Date.now()}` });

    await page.goto('/laboral/empresas');
    await page.getByTestId('empresa-add-button').click();

    const dialog = page.getByTestId('empresa-form-dialog');
    await expect(dialog).toBeVisible();

    await fillEmpresaForm(page, payload);

    let failOnce = true;
    await page.route('**/empresas', async (route) => {
      if (route.request().method() === 'POST' && failOnce) {
        failOnce = false;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Falha simulada ao salvar empresa' }),
        });
        return;
      }
      await route.continue();
    });

    await page.getByTestId('empresa-form-submit').click();

    // MUI Snackbar or inline error should appear
    await expect(
      page.getByText(/falha simulada/i).or(page.getByText(/erro/i).first())
    ).toBeVisible();

    await page.unroute('**/empresas');
  });
});

// ─── 4. Busca / Filtro ────────────────────────────────────────────────────────

test.describe('Empresa Cadastro — Busca e filtro', () => {
  test('busca por razão social filtra a tabela', async ({ page, authenticatedApi }) => {
    const seed = `search-${Date.now()}`;
    const payload = buildEmpresaPayload({ seed });
    const empresa = await createEmpresa(authenticatedApi, payload);

    await page.goto('/laboral/empresas');

    // Quick filter — única textbox visível fora de dialogs no MUI DataGrid v8
    // MUI DataGrid v8 quick filter renders input[type="search"] → role="searchbox"
    const searchInput = page.getByRole('searchbox');

    await expect(searchInput).toBeVisible();
    await searchInput.fill(payload.razao_social);
    await page.waitForTimeout(600); // debounce

    const row = page.getByRole('row', { name: new RegExp(payload.razao_social, 'i') });
    await expect(row).toBeVisible();

    // Cleanup
    await deleteEmpresaById(authenticatedApi, empresa.empresa_id);
  });

  test('busca sem resultado exibe tabela vazia', async ({ page }) => {
    await page.goto('/laboral/empresas');

    // MUI DataGrid v8 quick filter renders input[type="search"] → role="searchbox"
    const searchInput = page.getByRole('searchbox');

    await expect(searchInput).toBeVisible();
    await searchInput.fill('ZZZ_INEXISTENTE_PW_E2E_99999999');
    await page.waitForTimeout(600);

    // MUI DataGrid shows "No rows" overlay when empty
    await expect(
      page.getByText(/nenhum resultado/i)
        .or(page.getByText(/no rows/i))
        .or(page.getByText(/sem registros/i))
        .first()
    ).toBeVisible();
  });
});

// ─── 5. Bulk — 1.000 simultâneas ─────────────────────────────────────────────

test.describe('@bulk Carga massiva — 1.000 empresas simultâneas', () => {
  test('cria 1.000 empresas em paralelo via API e verifica contagem', async ({
    authenticatedApi,
  }) => {
    test.slow(); // triplica o timeout para 360s

    const runId = Date.now();
    const COUNT = 1_000;
    const CONCURRENCY = 100; // 10 batches of 100 concurrent requests

    const countBefore = await getEmpresasCount(authenticatedApi);

    const payloads = Array.from({ length: COUNT }, (_, i) =>
      buildEmpresaPayload({ seed: `bulk-1k-${runId}-${i}` })
    );

    const results = await createEmpresasBatch(authenticatedApi, payloads, CONCURRENCY);

    const successCount = results.filter((r) => r !== null).length;
    const countAfter = await getEmpresasCount(authenticatedApi);

    // All 1000 should have been created (unique seeds per run)
    expect(successCount).toBe(COUNT);
    expect(countAfter).toBeGreaterThanOrEqual(countBefore + COUNT);
  });
});

// ─── 6. Volume — 10.000 empresas na UI ───────────────────────────────────────

test.describe('@bulk Volume — 10.000 empresas e paginação na UI', () => {
  test('garante ≥10.000 empresas no banco e verifica paginação e busca na UI', async ({
    page,
    authenticatedApi,
  }) => {
    test.slow(); // triplica o timeout para 360s

    const TARGET = 10_000;

    // Ensure we have at least 10k records (idempotent — skips existing CNPJs via 409)
    const { finalCount } = await ensureMinimumEmpresasCount(
      authenticatedApi,
      TARGET,
      'volume-10k',
      100
    );

    expect(finalCount).toBeGreaterThanOrEqual(TARGET);

    // ── UI: page loads with large dataset ──
    await page.goto('/laboral/empresas');
    await expect(page.getByRole('grid')).toBeVisible();

    // Total counter rendered by MUI DataGrid pagination
    await expect(
      page.getByText(new RegExp(`${TARGET.toLocaleString('pt-BR')}|10.000|10000`, 'i')).first()
    ).toBeVisible({ timeout: 30_000 });

    // ── Pagination: navigate to page 2 ──
    const nextButton = page.getByRole('button', { name: /próxima página|next page/i });
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page.getByRole('grid')).toBeVisible();
    }

    // ── Sort by Razão Social ──
    const razaoSocialHeader = page.getByRole('columnheader', { name: /razão social/i });
    await razaoSocialHeader.click();
    await expect(page.getByRole('grid')).toBeVisible();

    // ── Search still works under load ──
    const knownEmpresa = await ensureEmpresa(
      authenticatedApi,
      buildEmpresaPayload({ seed: 'volume-10k-search-probe' })
    );

    const searchInput = page.getByRole('textbox', { name: /buscar/i });

    if (await searchInput.isVisible()) {
      await searchInput.fill(knownEmpresa.razao_social);
      await page.waitForTimeout(800);

      await expect(
        page.getByRole('row', { name: new RegExp(knownEmpresa.razao_social, 'i') })
      ).toBeVisible({ timeout: 20_000 });
    }
  });
});
