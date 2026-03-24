import { test, expect } from '../fixtures/auth';
import { buildFichaPayload } from '../fixtures/ficha-data';
import {
  createDetento,
  createDetentoWithFicha,
  getFichaPdfUrl,
  getFichasByDetento,
  getFirstUnidade,
} from '../helpers/api';
import {
  fillInternalFichaForm,
  prepareFichaSupportApis,
  renameUploadedDocument,
  uploadDocuments,
} from '../helpers/ficha-form';
import { expectPdfContainsFields } from '../helpers/pdf';

function detalhesDetentoUrlPattern(detentoId: string): RegExp {
  return new RegExp(`/reeducandos/detalhes/${detentoId}(?:\\?.*)?$`);
}

test.describe('Ficha cadastral interna', () => {
  test('exibe erros de validacao ao submeter formulario interno incompleto', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'minimal',
      seed: `interna-validacao-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const detento = await createDetento(authenticatedApi, draft.detento);

    await prepareFichaSupportApis(page);
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/new`);
    await expect(page.getByTestId('internal-ficha-form')).toBeVisible();

    await page.getByTestId('internal-submit').click();

    await expect(page.getByText(/RG é obrigatório/i).first()).toBeVisible();
    await expect(page.getByText(/Órgão expedidor é obrigatório/i).first()).toBeVisible();
    await expect(page.getByText(/UF do RG é obrigatória/i).first()).toBeVisible();
    await expect(page.getByText(/Naturalidade é obrigatória/i).first()).toBeVisible();
    await expect(page.getByText(/Profissão 01 é obrigatória/i).first()).toBeVisible();
    await expect(page.getByText(/Selecione ao menos um artigo penal/i).first()).toBeVisible();
    await expect(page.getByTestId('internal-documentos-error')).toContainText(
      /Anexe ao menos um documento em imagem/i
    );
  });

  test('@smoke cria, edita e abre o PDF da ficha pelo fluxo interno', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: `interna-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const detento = await createDetento(authenticatedApi, draft.detento);

    await prepareFichaSupportApis(page);
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/new`);
    await expect(page.getByTestId('internal-ficha-form')).toBeVisible();

    await fillInternalFichaForm(page, draft, { complete: true });
    await uploadDocuments(page, 'internal-documentos', ['validPng']);
    await page.getByTestId('internal-submit').click();

    await page.waitForURL(detalhesDetentoUrlPattern(detento.id));

    const fichasCriadas = await getFichasByDetento(authenticatedApi, detento.id);
    expect(fichasCriadas).toHaveLength(1);

    const ficha = fichasCriadas[0];
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/${ficha.id}/edit`);
    await expect(page.getByTestId('internal-ficha-form')).toBeVisible();

    await page.getByLabel(/Experiência profissional/i).fill('PW E2E experiencia editada');
    await page.getByLabel(/Nome de quem preencheu/i).fill('pw-e2e-edicao');
    await uploadDocuments(page, 'internal-documentos', ['validJpg']);
    await renameUploadedDocument(page, 'internal-documentos', 0, 'Documento interno atualizado');
    await page.getByTestId('internal-submit').click();

    await page.waitForURL(detalhesDetentoUrlPattern(detento.id));

    const fichasAtualizadas = await getFichasByDetento(authenticatedApi, detento.id);
    expect(fichasAtualizadas[0].experiencia_profissional).toBe('PW E2E experiencia editada');
    expect(fichasAtualizadas[0].documentos?.length ?? 0).toBeGreaterThanOrEqual(2);

    await page.goto(`/reeducandos/detalhes/${detento.id}?t=ficha_cadastral`);
    const fichaCard = page.getByTestId(`ficha-card-${ficha.id}`);
    await expect(fichaCard).toBeVisible();
    await fichaCard.hover();
    await page.getByTestId(`ficha-card-view-pdf-${ficha.id}`).click();

    const pdfUrl = await getFichaPdfUrl(authenticatedApi, ficha.id);
    await expectPdfContainsFields(authenticatedApi, pdfUrl, [
      draft.form.nome,
      draft.cpf,
      draft.form.unidade_prisional,
    ]);
  });

  test('permite desativar, reativar e excluir ficha interna no card', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: `interna-status-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const detento = await createDetento(authenticatedApi, draft.detento);

    await prepareFichaSupportApis(page);
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/new`);
    await expect(page.getByTestId('internal-ficha-form')).toBeVisible();

    await fillInternalFichaForm(page, draft, { complete: true });
    await uploadDocuments(page, 'internal-documentos', ['validPng']);
    await page.getByTestId('internal-submit').click();
    await page.waitForURL(detalhesDetentoUrlPattern(detento.id));

    let fichas = await getFichasByDetento(authenticatedApi, detento.id);
    expect(fichas).toHaveLength(1);
    const fichaId = fichas[0].id;

    await page.goto(`/reeducandos/detalhes/${detento.id}?t=ficha_cadastral`);
    const fichaCard = page.getByTestId(`ficha-card-${fichaId}`);
    await expect(fichaCard).toBeVisible();
    await fichaCard.hover();

    await page.getByTestId(`ficha-card-deactivate-${fichaId}`).click();
    await page.getByTestId(`ficha-card-confirm-deactivate-${fichaId}`).click();
    await expect
      .poll(async () => (await getFichasByDetento(authenticatedApi, detento.id))[0]?.status)
      .toBe('inativa');

    await fichaCard.hover();
    await page.getByTestId(`ficha-card-activate-${fichaId}`).click();
    await page.getByTestId(`ficha-card-confirm-activate-${fichaId}`).click();
    await expect
      .poll(async () => (await getFichasByDetento(authenticatedApi, detento.id))[0]?.status)
      .toBe('ativa');

    await fichaCard.hover();
    await page.getByTestId(`ficha-card-delete-${fichaId}`).click();
    await page.getByTestId(`ficha-card-confirm-delete-${fichaId}`).click();

    await expect(fichaCard).toHaveCount(0);
    fichas = await getFichasByDetento(authenticatedApi, detento.id);
    expect(fichas).toHaveLength(0);
  });

  test('permite criar do zero ao pular recuperacao de ficha inativa no fluxo interno', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: `interna-skip-recover-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const { detento } = await createDetentoWithFicha(authenticatedApi, {
      draft,
      status: 'inativa',
    });

    await prepareFichaSupportApis(page);
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/new`);

    const selector = page.getByTestId('ficha-inativa-selector');
    await expect(selector).toBeVisible();
    await page.getByTestId('ficha-inativa-skip').click();

    await expect(selector).toBeHidden();
    await expect(page.getByTestId('internal-ficha-form')).toBeVisible();
    await expect(page.locator('input[name="rg"]').first()).toHaveValue('');

    await fillInternalFichaForm(page, draft, { complete: true });
    await uploadDocuments(page, 'internal-documentos', ['validPng']);
    await page.getByTestId('internal-submit').click();
    await page.waitForURL(detalhesDetentoUrlPattern(detento.id));

    const fichas = await getFichasByDetento(authenticatedApi, detento.id);
    expect(fichas.filter((item) => item.status === 'ativa')).toHaveLength(1);
    expect(fichas.filter((item) => item.status === 'inativa').length).toBeGreaterThanOrEqual(1);
  });

  test('exibe erro quando a API falha ao salvar ficha interna', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'minimal',
      seed: `interna-erro-api-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const detento = await createDetento(authenticatedApi, draft.detento);

    await prepareFichaSupportApis(page);
    await page.goto(`/reeducandos/detalhes/${detento.id}/ficha-cadastral/new`);
    await expect(page.getByTestId('internal-ficha-form')).toBeVisible();

    await fillInternalFichaForm(page, draft);
    await uploadDocuments(page, 'internal-documentos', ['validPng']);

    let failOnce = true;
    await page.route('**/fichas-cadastrais', async (route) => {
      if (route.request().method() === 'POST' && failOnce) {
        failOnce = false;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Falha simulada ao salvar ficha interna' }),
        });
        return;
      }
      await route.continue();
    });

    await page.getByTestId('internal-submit').click();
    await expect(page.getByTestId('internal-form-error')).toContainText(
      /Falha simulada ao salvar ficha interna/i
    );
    await page.unroute('**/fichas-cadastrais');
  });
});
