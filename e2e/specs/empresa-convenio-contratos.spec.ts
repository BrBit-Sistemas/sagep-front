import type { Locator, TestInfo, APIRequestContext } from '@playwright/test';
import type { GerarContratoPdfResponseDto } from '../../src/api/empresa-convenios/empresa-convenios';

import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

import { downloadPdf, extractPdfText } from '../helpers/pdf';
import { test, expect, playwrightApiBaseUrl } from '../fixtures/auth';
import {
  gerarContratoPdf,
  getContratoPreview,
  prepareContratoConvenio,
  prepareContratoConvenios,
  expectContratoPreviewMatchesPayload,
} from '../helpers/empresa-convenio-api';

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 120);
}

function expectTextContainsFields(text: string, fields: string[]): void {
  const normalizedText = normalizeForSearch(text);
  const missing = fields.filter((field) => {
    const normalizedField = normalizeForSearch(field);
    return !text.includes(field) && !normalizedText.includes(normalizedField);
  });

  expect(missing, `Campos ausentes no contrato/preview: ${missing.join(', ')}`).toEqual([]);
}

async function expectLocatorContainsFields(locator: Locator, fields: string[]): Promise<void> {
  const text = (await locator.textContent()) ?? '';
  expectTextContainsFields(text, fields);
}

async function saveContratoPdfArtifact(
  request: APIRequestContext,
  result: GerarContratoPdfResponseDto,
  testInfo: TestInfo,
  basename: string
): Promise<{ bytes: number; pdfPath: string; text: string; txtPath: string }> {
  const outputDir = testInfo.outputPath('contratos-gerados');
  await mkdir(outputDir, { recursive: true });

  const safeName = sanitizeFilename(basename);
  const pdfPath = join(outputDir, `${safeName}.pdf`);
  const txtPath = join(outputDir, `${safeName}.txt`);
  const buffer = await downloadPdf(request, result.url);
  const text = await extractPdfText(buffer);

  await writeFile(pdfPath, buffer);
  await writeFile(txtPath, text, 'utf8');
  await testInfo.attach(`${safeName}.pdf`, { path: pdfPath, contentType: 'application/pdf' });
  await testInfo.attach(`${safeName}.txt`, { path: txtPath, contentType: 'text/plain' });

  return { bytes: buffer.byteLength, pdfPath, text, txtPath };
}

test.describe('Empresa Convênios — contratos', () => {
  test('gera PDF, abre o contrato e valida os parâmetros preenchidos', async ({
    page,
    context,
    authenticatedApi,
  }, testInfo) => {
    test.setTimeout(180_000);

    const prepared = await prepareContratoConvenio(authenticatedApi, {
      index: 0,
      seed: `ui-${Date.now()}`,
      templateCode: 'PADRAO_ORGAO_PUBLICO_GDF',
    });

    const preview = await getContratoPreview(authenticatedApi, prepared.convenio.convenio_id);
    expectContratoPreviewMatchesPayload(preview, prepared);

    await page.goto(`/laboral/convenios/${prepared.convenio.convenio_id}/contrato-preview`);

    const previewDocument = page.getByTestId('contrato-preview-documento');
    await expect(previewDocument).toBeVisible();
    await expectLocatorContainsFields(previewDocument, prepared.previewFields);

    const responsePromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(`/empresa-convenios/${prepared.convenio.convenio_id}/gerar-contrato-pdf`) &&
        response.request().method() === 'POST'
    );
    const popupPromise = context.waitForEvent('page');

    await page.getByTestId('contrato-gerar-pdf-button').click();

    const [response, popup] = await Promise.all([responsePromise, popupPromise]);
    expect(response.ok()).toBeTruthy();

    const result = (await response.json()) as GerarContratoPdfResponseDto;
    await expect.poll(() => popup.url()).not.toBe('about:blank');

    const artifact = await saveContratoPdfArtifact(
      authenticatedApi,
      result,
      testInfo,
      `${prepared.marker}-ui`
    );
    expect(artifact.bytes).toBeGreaterThan(0);
    expectTextContainsFields(artifact.text, prepared.pdfFields);

    await popup.close();
  });

  test('salva cargo/qualidade do preposto pelo formulário e usa no PDF', async ({
    page,
    authenticatedApi,
  }, testInfo) => {
    test.setTimeout(180_000);

    const prepared = await prepareContratoConvenio(authenticatedApi, {
      index: 1,
      seed: `preposto-${Date.now()}`,
      templateCode: 'PADRAO_FUNAP',
    });
    const prepostoInicial = prepared.payload.responsaveis?.find(
      (responsavel) => responsavel.tipo === 'PREPOSTO_OPERACIONAL'
    );
    const cargoAtualizado = `${prepared.marker} Qualidade Preposto Assinatura`;

    await page.goto(`/laboral/convenios/${prepared.convenio.convenio_id}/edit`);
    await page.getByRole('tab', { name: /Responsáveis/i }).click();

    const cargoPrepostoField = page.getByLabel('Cargo / qualidade');
    await expect(cargoPrepostoField).toBeVisible();
    await expect(cargoPrepostoField).toHaveValue(prepostoInicial?.cargo ?? '');

    await cargoPrepostoField.fill(cargoAtualizado);

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/empresa-convenios/${prepared.convenio.convenio_id}`) &&
        response.request().method() === 'PUT'
    );

    await page.getByRole('button', { name: /^Salvar$/i }).click();

    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok()).toBeTruthy();
    await expect(page).toHaveURL(
      new RegExp(`/laboral/convenios/${prepared.convenio.convenio_id}/contrato-preview$`)
    );

    const preview = await getContratoPreview(authenticatedApi, prepared.convenio.convenio_id);
    const prepostoPreview = preview.responsaveis.find(
      (responsavel) => responsavel.tipo === 'PREPOSTO_OPERACIONAL'
    );
    expect(prepostoPreview?.cargo).toBe(cargoAtualizado);

    const previewDocument = page.getByTestId('contrato-preview-documento');
    await expect(previewDocument).toBeVisible();
    await expectLocatorContainsFields(previewDocument, [cargoAtualizado]);

    const result = await gerarContratoPdf(authenticatedApi, prepared.convenio.convenio_id);
    const artifact = await saveContratoPdfArtifact(
      authenticatedApi,
      result,
      testInfo,
      `${prepared.marker}-preposto-cargo`
    );

    expect(artifact.bytes).toBeGreaterThan(0);
    expectTextContainsFields(artifact.text, [
      cargoAtualizado,
      prepostoPreview?.nome ?? '',
      prepared.empresa.razao_social,
    ]);
    expect(artifact.text).not.toContain('___________________');
  });
});

test.describe('Empresa Convênios — geração concorrente de contratos', () => {
  for (const count of [10, 20]) {
    test(`gera ${count} PDFs simultaneamente e valida os campos`, async ({
      playwright,
      adminToken,
      authenticatedApi,
    }, testInfo) => {
      test.setTimeout(count === 20 ? 480_000 : 300_000);

      const seed = `concorrente-${count}-${Date.now()}`;
      const preparedItems = await prepareContratoConvenios(authenticatedApi, {
        count,
        seed,
        templateCode: 'PADRAO_ORGAO_PUBLICO_GDF',
      });
      const apiContexts = await Promise.all(
        preparedItems.map(() =>
          playwright.request.newContext({
            baseURL: playwrightApiBaseUrl,
            extraHTTPHeaders: {
              Authorization: `Bearer ${adminToken}`,
            },
          })
        )
      );

      try {
        const generated = await Promise.all(
          preparedItems.map(async (prepared, index) => {
            const startedAt = Date.now();
            const result = await gerarContratoPdf(
              apiContexts[index],
              prepared.convenio.convenio_id
            );
            const artifact = await saveContratoPdfArtifact(
              apiContexts[index],
              result,
              testInfo,
              `${prepared.marker}-concorrente`
            );

            expect(artifact.bytes).toBeGreaterThan(0);
            expectTextContainsFields(artifact.text, prepared.pdfFields);

            return {
              convenio_id: prepared.convenio.convenio_id,
              filename: result.filename,
              marker: prepared.marker,
              pdf_id: result.pdf_id,
              url: result.url,
              bytes: artifact.bytes,
              duration_ms: Date.now() - startedAt,
              pdf_path: artifact.pdfPath,
              text_path: artifact.txtPath,
            };
          })
        );

        expect(generated).toHaveLength(count);
        expect(new Set(generated.map((item) => item.pdf_id)).size).toBe(count);

        const outputDir = testInfo.outputPath('contratos-gerados');
        await mkdir(outputDir, { recursive: true });
        const manifestPath = join(outputDir, `manifest-${count}.json`);
        await writeFile(manifestPath, JSON.stringify(generated, null, 2), 'utf8');
        await testInfo.attach(`manifest-${count}.json`, {
          path: manifestPath,
          contentType: 'application/json',
        });
      } finally {
        await Promise.all(apiContexts.map((api) => api.dispose()));
      }
    });
  }
});
