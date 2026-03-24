import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

import type { AssetName } from './file-factory';
import type { FichaDraft } from '../fixtures/ficha-data';

import { formatCpf } from '../fixtures/ficha-data';
import { getAssetPath } from './file-factory';

export const EXTERNAL_FICHA_PATH = '/ficha-cadastral-externa';
const PLAYWRIGHT_API_BASE_URL = (process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  ''
);

const stubProfissoes = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    nome: 'Advogado',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    nome: 'Enfermeiro',
  },
] as const;

const stubArtigosPenais = [
  {
    codigo: '157',
    codigoFormatado: 'CP 157',
    descricao: 'Roubo simples',
    tipo: 'CP',
    legislacao: 'CP',
    legislacaoNome: 'Codigo Penal',
    idUnico: 'CP:157',
  },
  {
    codigo: '155',
    codigoFormatado: 'CP 155',
    descricao: 'Furto simples',
    tipo: 'CP',
    legislacao: 'CP',
    legislacaoNome: 'Codigo Penal',
    idUnico: 'CP:155',
  },
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function prepareFichaSupportApis(page: Page): Promise<void> {
  await page.route(new RegExp(`^${escapeRegExp(PLAYWRIGHT_API_BASE_URL)}/profissoes(?:\\?.*)?$`), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: stubProfissoes,
        total: stubProfissoes.length,
        page: 0,
        limit: stubProfissoes.length,
      }),
    });
  });

  await page.route(new RegExp(`^${escapeRegExp(PLAYWRIGHT_API_BASE_URL)}/profissoes/[^?]+(?:\\?.*)?$`), async (route) => {
    const profissaoId = route.request().url().split('/').pop() ?? '';
    const profissao = stubProfissoes.find((item) => item.id === profissaoId);

    await route.fulfill({
      status: profissao ? 200 : 404,
      contentType: 'application/json',
      body: JSON.stringify(
        profissao ?? {
          message: 'Profissao nao encontrada',
        }
      ),
    });
  });

  await page.route(`${PLAYWRIGHT_API_BASE_URL}/api/artigos-penais`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(stubArtigosPenais),
    });
  });

  await page.route(`${PLAYWRIGHT_API_BASE_URL}/api/enderecos/estados`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 'DF', nome: 'Distrito Federal', sigla: 'DF' }]),
    });
  });

  await page.route(`${PLAYWRIGHT_API_BASE_URL}/api/enderecos/municipios/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: '1', nome: 'Brasília', estado_id: 'DF' }]),
    });
  });
}

function labelPattern(label: string | RegExp): string | RegExp {
  return typeof label === 'string' ? new RegExp(escapeRegExp(label), 'i') : label;
}

async function fillTextField(
  page: Page,
  label: string | RegExp,
  value: string
): Promise<void> {
  const byRole = page.getByRole('textbox', { name: labelPattern(label) }).first();
  const input =
    (await byRole.count()) > 0 ? byRole : page.getByLabel(labelPattern(label)).first();
  await expect(input).toBeVisible();
  await input.click();
  await input.fill(value);
}

async function fillDateField(
  page: Page,
  label: string | RegExp,
  value: string
): Promise<void> {
  const group = page.getByRole('group', { name: labelPattern(label) }).first();

  if ((await group.count()) > 0) {
    const [day, month, year] = value.split('/');
    await expect(group).toBeVisible();
    await group.getByRole('spinbutton', { name: 'Day' }).fill(day);
    await group.getByRole('spinbutton', { name: 'Month' }).fill(month);
    await group.getByRole('spinbutton', { name: 'Year' }).fill(year);
    await group.getByRole('spinbutton', { name: 'Year' }).press('Tab');
    return;
  }

  const input = page.getByLabel(labelPattern(label)).first();
  await expect(input).toBeVisible();
  await input.click();
  await input.fill(value);
  await input.press('Tab');
}

async function selectMuiOption(
  page: Page,
  label: string | RegExp,
  optionText: string | RegExp
): Promise<void> {
  const byRole = page.getByRole('combobox', { name: labelPattern(label) }).first();
  const input =
    (await byRole.count()) > 0 ? byRole : page.getByLabel(labelPattern(label)).first();
  await expect(input).toBeVisible();
  await input.click();

  const option = page.getByRole('option', {
    name: typeof optionText === 'string' ? new RegExp(escapeRegExp(optionText), 'i') : optionText,
  });

  await expect(option.first()).toBeVisible();
  await option.first().click();
}

async function selectAutocompleteOption(
  page: Page,
  label: string | RegExp,
  searchText: string,
  optionText?: string | RegExp
): Promise<void> {
  const byRole = page.getByRole('combobox', { name: labelPattern(label) }).first();
  const input =
    (await byRole.count()) > 0 ? byRole : page.getByLabel(labelPattern(label)).first();
  await expect(input).toBeVisible();
  await input.click();
  await input.press('Control+A');
  await input.press('Backspace');
  await input.pressSequentially(searchText, { delay: 60 });

  const option = optionText
    ? page.getByRole('option', {
        name:
          typeof optionText === 'string'
            ? new RegExp(escapeRegExp(optionText), 'i')
            : optionText,
      })
    : page.getByRole('option');

  await expect(option.first()).toBeVisible();
  await option.first().click();
}

async function setSwitchState(
  page: Page,
  label: string | RegExp,
  enabled: boolean
): Promise<void> {
  const input = page.getByRole('checkbox', { name: labelPattern(label) }).first();
  await expect(input).toBeVisible();

  if ((await input.isChecked()) !== enabled) {
    await input.click();
  }
}

export async function gotoExternalFicha(page: Page): Promise<void> {
  await prepareFichaSupportApis(page);
  await page.goto(EXTERNAL_FICHA_PATH);
  await expect(page.getByTestId('external-ficha-page')).toBeVisible();
}

export async function startExternalLookup(page: Page, cpf: string): Promise<void> {
  await gotoExternalFicha(page);
  await fillTextField(page, /^CPF$/i, formatCpf(cpf));
  await page.getByTestId('external-cpf-submit').click();
}

export async function confirmUnknownCpf(page: Page): Promise<void> {
  await expect(page.getByTestId('external-cpf-confirm-dialog')).toBeVisible();
  await page.getByTestId('external-cpf-confirm-proceed').click();
  await expect(page.getByTestId('external-ficha-form')).toBeVisible();
}

export async function uploadDocuments(
  page: Page,
  testId: string,
  assets: AssetName[]
): Promise<void> {
  const initialCount = await page.locator(`[data-testid^="${testId}-item-"]`).count();

  await page.getByTestId(`${testId}-input`).setInputFiles(
    assets.map((asset) => getAssetPath(asset))
  );

  await expect
    .poll(async () => page.locator(`[data-testid^="${testId}-item-"]`).count())
    .toBe(initialCount + assets.length);
}

export async function renameUploadedDocument(
  page: Page,
  testId: string,
  index: number,
  name: string
): Promise<void> {
  const input = page.getByTestId(`${testId}-name-${index}`);
  await expect(input).toBeVisible();
  await input.fill(name);
}

export async function removeUploadedDocument(
  page: Page,
  testId: string,
  index: number
): Promise<void> {
  await page.getByTestId(`${testId}-remove-${index}`).click();
}

async function selectFirstArticle(page: Page): Promise<void> {
  const input = page.getByLabel(/Artigos Penais/i).first();
  await expect(input).toBeVisible();
  await input.click();
  await expect(page.getByRole('option').first()).toBeVisible();
  await page.getByRole('option').first().click();
  await input.press('Escape');
}

async function fillAddressSection(page: Page, draft: FichaDraft): Promise<void> {
  await selectAutocompleteOption(
    page,
    /^Estado$/i,
    'Distrito',
    /Distrito Federal(?:\s+|\s*\()DF/i
  );
  await selectAutocompleteOption(page, /^Cidade$/i, 'Bras', /Brasília/i);
  await fillTextField(page, /^Logradouro$/i, draft.form.endereco.logradouro);
  await fillTextField(page, /^Número$/i, draft.form.endereco.numero);

  if (draft.form.endereco.complemento) {
    await fillTextField(page, /^Complemento$/i, draft.form.endereco.complemento);
  }

  await fillTextField(page, /^Bairro$/i, draft.form.endereco.bairro);
  await selectAutocompleteOption(
    page,
    /Região Administrativa \(RA\)/i,
    'Brasilia',
    /RA I - Brasília/i
  );
}

export async function fillExternalFichaForm(
  page: Page,
  draft: FichaDraft,
  options: { complete?: boolean } = {}
): Promise<void> {
  const { complete = false } = options;

  await fillTextField(page, /Nome completo/i, draft.form.nome);
  await fillTextField(page, /^RG$/i, draft.form.rg);
  await selectMuiOption(page, /Órgão expedidor/i, /SSP/i);
  await selectMuiOption(page, /UF do RG/i, /Distrito Federal/i);
  await fillDateField(page, /Data de nascimento/i, draft.form.data_nascimento_display);
  await fillTextField(page, /Naturalidade \(Cidade\)/i, draft.form.naturalidade);
  await selectMuiOption(page, /UF de naturalidade/i, /Distrito Federal/i);
  await fillTextField(page, /Nome da mãe/i, draft.form.filiacao_mae);
  await fillTextField(page, /Nome do pai/i, draft.form.filiacao_pai);
  await selectMuiOption(page, /Regime/i, /Semiaberto/i);
  await selectMuiOption(page, /Unidade prisional/i, new RegExp(escapeRegExp(draft.form.unidade_prisional), 'i'));
  await fillTextField(page, /Prontuário/i, draft.form.prontuario);
  await selectFirstArticle(page);
  await fillTextField(page, /Número SEI/i, draft.form.sei.replace(/\D/g, ''));
  await fillTextField(page, /Telefone/i, draft.form.telefone);
  await selectMuiOption(page, /Escolaridade/i, /Ensino Médio Completo/i);
  await selectAutocompleteOption(
    page,
    /Disponibilidade de trabalho/i,
    draft.form.disponibilidade_trabalho,
    /MANHÃ/i
  );

  if (complete) {
    await fillAddressSection(page, draft);
    await setSwitchState(page, /Tem problema de saúde/i, true);
    await fillTextField(page, /Qual\(is\) problema\(s\) de saúde/i, draft.form.problema_saude);
    await selectMuiOption(
      page,
      /Região Administrativa onde não pode trabalhar/i,
      /Ceilândia/i
    );
    await fillTextField(page, /Experiência profissional/i, draft.form.experiencia_profissional);
    await fillTextField(
      page,
      /Fez curso no sistema prisional\? Qual\?/i,
      draft.form.fez_curso_sistema_prisional
    );
    await setSwitchState(page, /Já trabalhou pela FUNAP/i, true);
    await fillTextField(page, /Ano do trabalho anterior pela FUNAP/i, '2024');
    await selectAutocompleteOption(
      page,
      /Profissão 01/i,
      draft.form.profissao_01_search
    );
    await selectAutocompleteOption(
      page,
      /Profissão 02/i,
      draft.form.profissao_02_search
    );
  } else {
    await fillTextField(page, /Experiência profissional/i, draft.form.experiencia_profissional);
    await selectAutocompleteOption(page, /Profissão 01/i, draft.form.profissao_01_search);
  }

  await fillTextField(
    page,
    /Nome de quem preencheu/i,
    draft.form.responsavel_preenchimento
  );
}

export async function fillInternalFichaForm(
  page: Page,
  draft: FichaDraft,
  options: { complete?: boolean } = {}
): Promise<void> {
  const { complete = false } = options;

  await fillTextField(page, /^RG$/i, draft.form.rg);
  await selectMuiOption(page, /Órgão expedidor/i, /SSP/i);
  await selectMuiOption(page, /UF do RG/i, /^DF/i);
  await fillTextField(page, /Naturalidade \(Cidade\)/i, draft.form.naturalidade);
  await selectMuiOption(page, /^UF$/i, /Distrito Federal/i);
  await fillTextField(page, /Nome do pai/i, draft.form.filiacao_pai);
  await selectFirstArticle(page);
  await fillTextField(page, /Número SEI/i, draft.form.sei.replace(/\D/g, ''));
  await fillTextField(page, /Telefone/i, draft.form.telefone);

  if (complete) {
    await fillAddressSection(page, draft);
    await setSwitchState(page, /Tem problema de saúde/i, true);
    await fillTextField(page, /Qual\(is\) problema\(s\) de saúde/i, draft.form.problema_saude);
    await selectMuiOption(
      page,
      /Região Administrativa onde não pode trabalhar/i,
      /Ceilândia/i
    );
    await fillTextField(page, /Experiência profissional/i, draft.form.experiencia_profissional);
    await fillTextField(
      page,
      /Fez curso no sistema prisional\? Qual\?/i,
      draft.form.fez_curso_sistema_prisional
    );
    await selectAutocompleteOption(
      page,
      /Disponibilidade de trabalho/i,
      'MAN',
      /MANHÃ/i
    );
    await setSwitchState(page, /Já trabalhou pela FUNAP/i, true);
    await fillTextField(page, /Ano do trabalho anterior pela FUNAP/i, '2024');
    await selectAutocompleteOption(
      page,
      /Profissão 01/i,
      draft.form.profissao_01_search
    );
    await selectAutocompleteOption(
      page,
      /Profissão 02/i,
      draft.form.profissao_02_search
    );
  } else {
    await fillTextField(page, /Experiência profissional/i, draft.form.experiencia_profissional);
    await selectAutocompleteOption(page, /Profissão 01/i, draft.form.profissao_01_search);
  }

  await fillTextField(
    page,
    /Nome de quem preencheu/i,
    draft.form.responsavel_preenchimento
  );
}
