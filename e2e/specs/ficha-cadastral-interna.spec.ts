import { test, expect } from '../fixtures/auth';
import { buildFichaPayload } from '../fixtures/ficha-data';
import {
  createDetento,
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
});
