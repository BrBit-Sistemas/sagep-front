import { test, expect } from '../fixtures/auth';
import { buildFichaPayload } from '../fixtures/ficha-data';
import {
  buildFichaRequestFromDraft,
  createDetento,
  createDetentoWithFicha,
  findDetentoByCpf,
  getFichaPdfUrl,
  getFichasByDetento,
  getFirstUnidade,
  uploadDocumento,
} from '../helpers/api';
import {
  confirmUnknownCpf,
  fillExternalFichaForm,
  gotoExternalFicha,
  startExternalLookup,
  uploadDocuments,
} from '../helpers/ficha-form';
import { expectPdfContainsFields } from '../helpers/pdf';

async function buildDraftForTest(seed: string, authenticatedApi: Parameters<typeof getFirstUnidade>[0]) {
  const unidade = await getFirstUnidade(authenticatedApi);
  const draft = buildFichaPayload({
    mode: 'minimal',
    seed,
    unidadeId: unidade.id,
    unidadeNome: unidade.nome,
  });

  return { draft, unidade };
}

test.describe('Ficha cadastral externa', () => {
  test('@smoke bloqueia CPF invalido logo na busca', async ({ page }) => {
    await gotoExternalFicha(page);
    await page.getByTestId('external-cpf-input').fill('123.456.789-00');
    await page.getByTestId('external-cpf-submit').click();

    await expect(page.getByText('CPF inválido')).toBeVisible();
  });

  test('abre a confirmacao para CPF inexistente', async ({ page, authenticatedApi }) => {
    const { draft } = await buildDraftForTest(`cpf-inexistente-${Date.now()}`, authenticatedApi);

    await startExternalLookup(page, draft.cpf);

    await expect(page.getByTestId('external-cpf-confirm-dialog')).toBeVisible();
    await page.getByTestId('external-cpf-confirm-proceed').click();
    await expect(page.getByTestId('external-ficha-form')).toBeVisible();
  });

  test('bloqueia criacao quando ja existe ficha ativa para o CPF', async ({
    page,
    authenticatedApi,
  }) => {
    const { draft } = await buildDraftForTest(`cpf-ativo-${Date.now()}`, authenticatedApi);
    await createDetentoWithFicha(authenticatedApi, { draft, status: 'ativa' });

    await startExternalLookup(page, draft.cpf);

    await expect(page.getByTestId('external-active-warning')).toContainText(
      /Já existe uma ficha cadastral ativa/i
    );
  });

  test('permite seguir quando o detento existe e nao ha ficha ativa', async ({
    page,
    authenticatedApi,
  }) => {
    const { draft } = await buildDraftForTest(`cpf-sem-ficha-${Date.now()}`, authenticatedApi);
    await createDetento(authenticatedApi, draft.detento);

    await startExternalLookup(page, draft.cpf);

    await expect(page.getByTestId('external-ficha-form')).toBeVisible();
    await expect(page.locator('input[name="nome"]').first()).toHaveValue(draft.detento.nome);
    await expect(page.locator('input[name="cpf"]').first()).toHaveValue(draft.cpf);
  });

  test('@smoke cria uma ficha externa minima com sucesso', async ({
    page,
    authenticatedApi,
  }) => {
    const { draft } = await buildDraftForTest(`externa-minima-${Date.now()}`, authenticatedApi);

    await startExternalLookup(page, draft.cpf);
    await confirmUnknownCpf(page);
    await fillExternalFichaForm(page, draft);
    await uploadDocuments(page, 'external-documentos', ['validPng']);
    await page.getByTestId('external-submit').click();

    await expect(page.getByTestId('external-success-alert')).toContainText(
      /Ficha cadastral criada com sucesso/i
    );

    const detento = await findDetentoByCpf(authenticatedApi, draft.cpf);
    expect(detento).not.toBeNull();

    const fichas = await getFichasByDetento(authenticatedApi, detento!.id);
    expect(fichas.some((ficha) => ficha.status === 'ativa')).toBeTruthy();
  });

  test('exibe erros de validacao quando o formulario e submetido vazio', async ({
    page,
    authenticatedApi,
  }) => {
    const { draft } = await buildDraftForTest(`validacao-vazio-${Date.now()}`, authenticatedApi);

    await startExternalLookup(page, draft.cpf);
    await confirmUnknownCpf(page);
    await page.getByTestId('external-submit').click();

    await expect(page.getByText(/Nome completo é obrigatório/i).first()).toBeVisible();
    await expect(page.getByText(/Data de nascimento é obrigatória/i).first()).toBeVisible();
    await expect(page.getByText(/Profissão 01 é obrigatória/i).first()).toBeVisible();
    await expect(page.getByText(/Selecione ao menos um artigo penal/i).first()).toBeVisible();
    await expect(page.getByTestId('external-documentos-error')).toContainText(
      /Anexe ao menos um documento em imagem/i
    );
  });

  test('cria uma ficha externa completa e valida o PDF gerado', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: `externa-completa-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    await startExternalLookup(page, draft.cpf);
    await confirmUnknownCpf(page);
    await fillExternalFichaForm(page, draft, { complete: true });
    await uploadDocuments(page, 'external-documentos', ['validPng', 'validJpg']);
    await page.getByTestId('external-submit').click();

    await expect(page.getByTestId('external-success-alert')).toContainText(
      /Ficha cadastral criada com sucesso/i
    );

    const detento = await findDetentoByCpf(authenticatedApi, draft.cpf);
    expect(detento).not.toBeNull();

    const fichas = await getFichasByDetento(authenticatedApi, detento!.id);
    expect(fichas).toHaveLength(1);

    const pdfUrl = await getFichaPdfUrl(authenticatedApi, fichas[0].id);
    await expectPdfContainsFields(authenticatedApi, pdfUrl, [
      draft.form.nome,
      draft.cpf,
      unidade.nome,
    ]);
  });

  test('recupera dados de ficha inativa e cria nova ficha ativa', async ({
    page,
    authenticatedApi,
  }) => {
    const unidade = await getFirstUnidade(authenticatedApi);
    const draft = buildFichaPayload({
      mode: 'complete',
      seed: `externa-inativa-${Date.now()}`,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
    });

    const { detento, ficha } = await createDetentoWithFicha(authenticatedApi, {
      draft,
      status: 'inativa',
    });

    await startExternalLookup(page, draft.cpf);
    await expect(page.getByTestId('external-recovery-step')).toBeVisible();
    await page.getByTestId(`ficha-inativa-select-${ficha.id}`).click();
    await expect(page.getByTestId('external-ficha-form')).toBeVisible();
    await expect(page.locator('input[name="rg"]').first()).toHaveValue(draft.form.rg);

    await uploadDocuments(page, 'external-documentos', ['validJpg']);
    await page.getByTestId('external-submit').click();

    await expect(page.getByTestId('external-success-alert')).toContainText(
      /Ficha cadastral criada com sucesso/i
    );

    const fichas = await getFichasByDetento(authenticatedApi, detento.id);
    expect(fichas.filter((item) => item.status === 'ativa')).toHaveLength(1);
    expect(fichas.filter((item) => item.status === 'inativa').length).toBeGreaterThanOrEqual(1);
  });

  test.describe.serial('@serial concorrencia', () => {
    test('duas submissoes quase simultaneas retornam um sucesso e um conflito', async ({
      authenticatedApi,
    }) => {
      const { draft } = await buildDraftForTest(`concorrencia-${Date.now()}`, authenticatedApi);
      const detento = await createDetento(authenticatedApi, draft.detento);

      const [uploadA, uploadB] = await Promise.all([
        uploadDocumento(authenticatedApi, 'validPng', detento.id),
        uploadDocumento(authenticatedApi, 'validJpg', detento.id),
      ]);

      const payloadA = buildFichaRequestFromDraft({
        draft,
        detentoId: detento.id,
        documentos: [uploadA],
      });
      const payloadB = buildFichaRequestFromDraft({
        draft,
        detentoId: detento.id,
        documentos: [uploadB],
      });

      const [responseA, responseB] = await Promise.all([
        authenticatedApi.post('/fichas-cadastrais', { data: payloadA }),
        authenticatedApi.post('/fichas-cadastrais', { data: payloadB }),
      ]);

      const statuses = [responseA.status(), responseB.status()].sort();
      expect(statuses).toEqual([201, 409]);
    });
  });
});
