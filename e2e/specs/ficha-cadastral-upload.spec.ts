import { test, expect } from '../fixtures/auth';
import { buildFichaPayload } from '../fixtures/ficha-data';
import { assetPaths } from '../helpers/file-factory';
import { getFirstUnidade } from '../helpers/api';
import {
  confirmUnknownCpf,
  fillExternalFichaForm,
  startExternalLookup,
  uploadDocuments,
  renameUploadedDocument,
  removeUploadedDocument,
} from '../helpers/ficha-form';

async function openReadyForm(page: Parameters<typeof startExternalLookup>[0], authenticatedApi: Parameters<typeof getFirstUnidade>[0], seed: string) {
  const unidade = await getFirstUnidade(authenticatedApi);
  const draft = buildFichaPayload({
    mode: 'minimal',
    seed,
    unidadeId: unidade.id,
    unidadeNome: unidade.nome,
  });

  await startExternalLookup(page, draft.cpf);
  await confirmUnknownCpf(page);
  await fillExternalFichaForm(page, draft);

  return draft;
}

test.describe('Uploads da ficha cadastral', () => {
  test('aceita PNG/JPG, permite renomear e remover documentos', async ({
    page,
    authenticatedApi,
  }) => {
    await openReadyForm(page, authenticatedApi, `uploads-validos-${Date.now()}`);
    await uploadDocuments(page, 'external-documentos', ['validPng', 'validJpg']);

    await renameUploadedDocument(page, 'external-documentos', 0, 'Documento principal PW E2E');
    await expect(page.getByTestId('external-documentos-name-0')).toHaveValue(
      'Documento principal PW E2E'
    );

    await removeUploadedDocument(page, 'external-documentos', 1);
    await expect
      .poll(async () => page.locator('[data-testid^="external-documentos-item-"]').count())
      .toBe(1);
  });

  test('exibe erro ao enviar arquivo que nao e imagem', async ({
    page,
    authenticatedApi,
  }) => {
    await openReadyForm(page, authenticatedApi, `upload-txt-${Date.now()}`);
    await page.getByTestId('external-documentos-input').setInputFiles([
      assetPaths.invalidTxt,
    ]);

    await expect(page.locator('[data-testid^="external-documentos-pending-"]')).toContainText(
      /imagem|anexad/i
    );
  });

  test('exibe erro ao enviar arquivo acima do limite', async ({
    page,
    authenticatedApi,
  }) => {
    await openReadyForm(page, authenticatedApi, `upload-grande-${Date.now()}`);
    await page.getByTestId('external-documentos-input').setInputFiles([
      assetPaths.largePng,
    ]);

    await expect(page.locator('[data-testid^="external-documentos-pending-"]')).toContainText(
      /large|10 MB|Payload Too Large|File too large/i
    );
  });

  test('permite retry quando o primeiro upload falha de forma transitória', async ({
    page,
    authenticatedApi,
  }) => {
    await openReadyForm(page, authenticatedApi, `upload-retry-${Date.now()}`);

    let firstUploadFailed = false;
    await page.route('**/fichas-cadastrais/documentos/upload', async (route) => {
      if (!firstUploadFailed) {
        firstUploadFailed = true;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Falha temporaria de upload' }),
        });
        return;
      }

      await route.continue();
    });

    await page.getByTestId('external-documentos-input').setInputFiles([
      assetPaths.validPng,
    ]);

    await expect(page.locator('[data-testid^="external-documentos-pending-"]')).toContainText(
      'Falha temporaria de upload'
    );

    await page.locator('[data-testid^="external-documentos-retry-"]').first().click();
    await expect
      .poll(async () => page.locator('[data-testid^="external-documentos-item-"]').count())
      .toBe(1);
  });
});
