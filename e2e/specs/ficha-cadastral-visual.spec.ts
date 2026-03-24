import { test, expect } from '../fixtures/auth';
import { buildFichaPayload } from '../fixtures/ficha-data';
import { ensureDetentoWithFicha, getFirstUnidade } from '../helpers/api';
import {
  confirmUnknownCpf,
  fillExternalFichaForm,
  prepareFichaSupportApis,
  startExternalLookup,
  uploadDocuments,
} from '../helpers/ficha-form';

test.describe('Snapshots visuais da ficha cadastral', () => {
  test('@visual etapa inicial do CPF', async ({ page }) => {
    await page.goto('/ficha-cadastral-externa');
    await expect(page.getByTestId('external-ficha-page')).toHaveScreenshot(
      'external-cpf-inicial.png',
      { animations: 'disabled', caret: 'hide' }
    );
  });

  test('@visual aviso de ficha ativa', async ({ page, authenticatedApi }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'minimal',
      seed: 'visual-ativa',
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    await ensureDetentoWithFicha(authenticatedApi, { draft, status: 'ativa' });
    await startExternalLookup(page, draft.cpf);

    await expect(page.getByTestId('external-ficha-page')).toHaveScreenshot(
      'external-cpf-aviso-ativa.png',
      { animations: 'disabled', caret: 'hide' }
    );
  });

  test('@visual tela de recuperacao de ficha inativa', async ({ page, authenticatedApi }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: 'visual-inativa',
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    await ensureDetentoWithFicha(authenticatedApi, { draft, status: 'inativa' });
    await startExternalLookup(page, draft.cpf);

    await expect(page.getByTestId('external-recovery-step')).toHaveScreenshot(
      'external-recuperacao-inativa.png',
      { animations: 'disabled', caret: 'hide' }
    );
  });

  test('@visual formulario externo preenchido e documentos com preview', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: 'visual-form',
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    await startExternalLookup(page, draft.cpf);
    await confirmUnknownCpf(page);
    await fillExternalFichaForm(page, draft, { complete: true });
    await uploadDocuments(page, 'external-documentos', ['validPng']);

    const dataAbertura = page.getByLabel(/Data da abertura ficha/i);
    await expect(page.getByTestId('external-ficha-form')).toHaveScreenshot('external-form-base.png', {
      animations: 'disabled',
      caret: 'hide',
      mask: [dataAbertura],
    });

    await expect(page.getByTestId('external-documentos')).toHaveScreenshot(
      'external-documentos-preview.png',
      { animations: 'disabled', caret: 'hide' }
    );
  });

  test('@visual estado de sucesso apos criar ficha', async ({ page, authenticatedApi }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'minimal',
      seed: `visual-sucesso-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    await startExternalLookup(page, draft.cpf);
    await confirmUnknownCpf(page);
    await fillExternalFichaForm(page, draft);
    await uploadDocuments(page, 'external-documentos', ['validPng']);
    await page.getByTestId('external-submit').click();
    await expect(page.getByTestId('external-success-alert')).toContainText(
      /Ficha cadastral criada com sucesso/i
    );
    await expect(page.getByTestId('external-ficha-form')).toHaveCount(0);

    await expect(page.getByTestId('external-ficha-page')).toHaveScreenshot(
      'external-sucesso.png',
      { animations: 'disabled', caret: 'hide' }
    );
  });

  test('@visual tela interna de edicao estavel', async ({ page, authenticatedApi }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: 'visual-interna',
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const { detento, ficha } = await ensureDetentoWithFicha(authenticatedApi, {
      draft,
      status: 'ativa',
    });
    await prepareFichaSupportApis(page);
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/${ficha.id}/edit`);

    await expect(page.getByTestId('internal-ficha-form')).toHaveScreenshot(
      'internal-form-edit.png',
      { animations: 'disabled', caret: 'hide' }
    );
  });
});
