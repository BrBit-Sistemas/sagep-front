import type { APIResponse, APIRequestContext } from '@playwright/test';
import type { EmpresaResponse } from './empresa-api';
import type {
  CodigoTemplateContrato,
  ReadTemplateContratoDto,
  ReadTabelaProdutividadeDto,
} from '../../src/api/empresa-convenios/convenio-contrato-catalog';
import type {
  ContratoPreviewDto,
  ReadEmpresaConvenioDto,
  CreateEmpresaConvenioDto,
  GerarContratoPdfResponseDto,
} from '../../src/api/empresa-convenios/empresa-convenios';

import { expect } from '@playwright/test';

import { createEmpresa } from './empresa-api';
import { buildEmpresaPayload } from '../fixtures/empresa-data';

type PaginatedResponse<T> = {
  items: T[];
  total: number;
};

type ProfissaoResponse = {
  id: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
};

export type PreparedContratoConvenio = {
  empresa: EmpresaResponse;
  convenio: ReadEmpresaConvenioDto;
  marker: string;
  payload: CreateEmpresaConvenioDto;
  pdfFields: string[];
  previewFields: string[];
  template: ReadTemplateContratoDto;
};

async function parseJsonResponse<T>(response: APIResponse): Promise<T> {
  const text = await response.text();
  expect(response.ok(), text).toBeTruthy();
  return (text ? JSON.parse(text) : undefined) as T;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatDateBR(value: string): string {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function uniqueDigits(seed: string, length: number): string {
  const digits = Array.from(seed)
    .map((char) => String(char.charCodeAt(0) % 10))
    .join('');

  return digits.padEnd(length, '7').slice(0, length);
}

export async function listTemplateContratos(
  api: APIRequestContext
): Promise<ReadTemplateContratoDto[]> {
  const response = await api.get('/empresa-convenios/catalog/template-contratos');
  return parseJsonResponse<ReadTemplateContratoDto[]>(response);
}

export async function listTabelasProdutividade(
  api: APIRequestContext
): Promise<ReadTabelaProdutividadeDto[]> {
  const response = await api.get('/empresa-convenios/catalog/tabelas-produtividade');
  return parseJsonResponse<ReadTabelaProdutividadeDto[]>(response);
}

async function findProfissaoByName(
  api: APIRequestContext,
  nome: string
): Promise<ProfissaoResponse | null> {
  const response = await api.get('/profissoes', {
    params: { page: 0, limit: 10, search: nome, ativo: true },
  });
  const body = await parseJsonResponse<PaginatedResponse<ProfissaoResponse>>(response);
  return body.items.find((item) => item.nome === nome && item.ativo) ?? null;
}

async function createProfissao(api: APIRequestContext, nome: string): Promise<ProfissaoResponse> {
  const response = await api.post('/profissoes', {
    data: {
      nome,
      descricao: `${nome} criada pelo Playwright para contratos de convênio`,
      ativo: true,
    },
  });

  if (response.status() === 409) {
    const existing = await findProfissaoByName(api, nome);
    if (existing) return existing;
  }

  return parseJsonResponse<ProfissaoResponse>(response);
}

export async function ensureProfissoesContrato(
  api: APIRequestContext,
  seed: string
): Promise<ProfissaoResponse[]> {
  const nomes = [
    `PW Contrato ${seed} Operador`,
    `PW Contrato ${seed} Assistente`,
    `PW Contrato ${seed} Supervisor`,
  ];

  return Promise.all(nomes.map((nome) => createProfissao(api, nome)));
}

export async function createEmpresaConvenio(
  api: APIRequestContext,
  payload: CreateEmpresaConvenioDto
): Promise<ReadEmpresaConvenioDto> {
  const response = await api.post('/empresa-convenios', { data: payload });
  return parseJsonResponse<ReadEmpresaConvenioDto>(response);
}

export async function getContratoPreview(
  api: APIRequestContext,
  convenioId: string
): Promise<ContratoPreviewDto> {
  const response = await api.get(`/empresa-convenios/${convenioId}/contrato-preview`);
  return parseJsonResponse<ContratoPreviewDto>(response);
}

export async function gerarContratoPdf(
  api: APIRequestContext,
  convenioId: string,
  timeout = 180_000
): Promise<GerarContratoPdfResponseDto> {
  const response = await api.post(`/empresa-convenios/${convenioId}/gerar-contrato-pdf`, {
    timeout,
  });
  return parseJsonResponse<GerarContratoPdfResponseDto>(response);
}

function pickTemplate(
  templates: ReadTemplateContratoDto[],
  preferredCode?: CodigoTemplateContrato
): ReadTemplateContratoDto {
  const activeTemplates = templates.filter((template) => template.ativo);
  const preferred = activeTemplates.find((template) => template.codigo === preferredCode);
  const gdf = activeTemplates.find((template) => template.codigo === 'PADRAO_ORGAO_PUBLICO_GDF');
  const fallback = activeTemplates[0];

  if (!preferred && !gdf && !fallback) {
    throw new Error('Nenhum template de contrato ativo encontrado para os testes.');
  }

  return preferred ?? gdf ?? fallback;
}

function buildConvenioPayload(options: {
  empresa: EmpresaResponse;
  index: number;
  marker: string;
  profissoes: ProfissaoResponse[];
  tabelaProdutividade?: ReadTabelaProdutividadeDto;
  template: ReadTemplateContratoDto;
}): CreateEmpresaConvenioDto {
  const { empresa, index, marker, profissoes, tabelaProdutividade, template } = options;
  const suffix = uniqueDigits(`${marker}-${index}`, 8);
  const isIntramuros = template.codigo === 'PADRAO_INTRAMUROS';

  return {
    empresa_id: empresa.empresa_id,
    modalidade_execucao: isIntramuros ? 'INTRAMUROS' : 'EXTRAMUROS',
    regimes_permitidos: [2, 3, 4],
    artigos_vedados: [`${marker} CP 157`, `${marker} CP 213`],
    max_reeducandos: 12,
    permite_variacao_quantidade: true,
    data_inicio: '2026-01-15',
    data_fim: '2027-01-14',
    data_repactuacao: '2026-07-15',
    tipo_calculo_remuneracao: 'MENSAL',
    usa_nivel: true,
    valor_nivel_i: 1518.11,
    valor_nivel_ii: 1718.22,
    valor_nivel_iii: 1918.33,
    transporte_responsavel: 'EMPRESA',
    alimentacao_responsavel: 'FUNAP',
    valor_transporte: 321.45,
    valor_alimentacao: 654.32,
    beneficio_variavel_por_dia: false,
    observacao_beneficio: `${marker} observacao beneficio`,
    quantidade_nivel_i: 3,
    quantidade_nivel_ii: 4,
    quantidade_nivel_iii: 5,
    permite_bonus_produtividade: true,
    bonus_produtividade_descricao: `${marker} bonus produtividade`,
    bonus_produtividade_tabela_json: [
      { grau: 'A', nome: `${marker} faixa ouro`, percentual: 40 },
      { grau: 'B', nome: `${marker} faixa prata`, percentual: 20 },
    ],
    percentual_gestao: 12.5,
    percentual_contrapartida: 7.5,
    observacoes: `${marker} observacoes gerais`,
    numero_contrato: `${1000 + index}/2026`,
    processo_sei: `00138-0000${suffix.slice(0, 5)}/2026-40`,
    doc_sei: `DOC-${suffix.slice(0, 6)}`,
    siggo_numero: `SIGGO-${suffix.slice(2, 8)}`,
    locais_execucao: [
      {
        logradouro: `${marker} Rua execucao`,
        numero: '123',
        complemento: `${marker} complemento`,
        bairro: 'Asa Norte',
        cidade: 'Brasilia',
        estado: 'DF',
        cep: '70040900',
        referencia: `${marker} referencia local`,
      },
    ],
    template_contrato_id: template.template_contrato_id,
    jornada_tipo: `${marker} jornada semanal`,
    carga_horaria_semanal: 44,
    escala: `${marker} escala 12x36`,
    horario_inicio: '06:30',
    horario_fim: '18:30',
    possui_seguro_acidente: true,
    tipo_cobertura_seguro: `${marker} cobertura seguro`,
    observacao_seguro: `${marker} observacao seguro`,
    observacao_juridica: `${marker} observacao juridica`,
    clausula_adicional: `${marker} clausula adicional`,
    descricao_complementar_objeto: `${marker} descricao objeto`,
    observacao_operacional: `${marker} observacao operacional`,
    tabela_produtividade_id: tabelaProdutividade?.tabela_produtividade_id,
    responsaveis: [
      {
        tipo: 'REPRESENTANTE_LEGAL',
        nome: `${marker} Representante Legal`,
        cargo: `${marker} Cargo Legal`,
        documento: `111${suffix.slice(0, 8)}`,
        email: `legal.${suffix}@playwright.test`,
        telefone: `619${suffix.slice(0, 8)}`,
      },
      {
        tipo: 'PREPOSTO_OPERACIONAL',
        nome: `${marker} Preposto Operacional`,
        cargo: `${marker} Cargo Operacional`,
        documento: `222${suffix.slice(0, 8)}`,
        email: `operacional.${suffix}@playwright.test`,
        telefone: `618${suffix.slice(0, 8)}`,
      },
    ],
    distribuicao_profissoes: [
      {
        profissao_id: profissoes[0].id,
        quantidade: 2,
        nivel: 'I',
        observacao: `${marker} observacao profissao I`,
      },
      {
        profissao_id: profissoes[1].id,
        quantidade: 3,
        nivel: 'II',
        observacao: `${marker} observacao profissao II`,
      },
      {
        profissao_id: profissoes[2].id,
        quantidade: 4,
        nivel: 'III',
        observacao: `${marker} observacao profissao III`,
      },
    ],
  };
}

function buildExpectedFields(options: {
  empresa: EmpresaResponse;
  marker: string;
  payload: CreateEmpresaConvenioDto;
  profissoes: ProfissaoResponse[];
  template: ReadTemplateContratoDto;
}): { pdfFields: string[]; previewFields: string[] } {
  const { empresa, marker, payload, profissoes, template } = options;
  const representante = payload.responsaveis?.find(
    (responsavel) => responsavel.tipo === 'REPRESENTANTE_LEGAL'
  );
  const preposto = payload.responsaveis?.find(
    (responsavel) => responsavel.tipo === 'PREPOSTO_OPERACIONAL'
  );
  const previewFields = [
    marker,
    empresa.razao_social,
    onlyDigits(empresa.cnpj),
    payload.numero_contrato ?? '',
    payload.processo_sei ?? '',
    payload.doc_sei ?? '',
    payload.siggo_numero ?? '',
    formatDateBR(payload.data_inicio),
    payload.data_fim ? formatDateBR(payload.data_fim) : '',
    payload.data_repactuacao ? formatDateBR(payload.data_repactuacao) : '',
    payload.artigos_vedados?.[0] ?? '',
    payload.artigos_vedados?.[1] ?? '',
    payload.jornada_tipo ?? '',
    payload.escala ?? '',
    payload.horario_inicio ?? '',
    payload.horario_fim ?? '',
    payload.tipo_cobertura_seguro ?? '',
    payload.observacao_seguro ?? '',
    payload.observacao_beneficio ?? '',
    payload.bonus_produtividade_descricao ?? '',
    String(payload.bonus_produtividade_tabela_json?.[0]?.nome ?? ''),
    String(payload.bonus_produtividade_tabela_json?.[1]?.nome ?? ''),
    payload.observacoes ?? '',
    payload.observacao_juridica ?? '',
    payload.clausula_adicional ?? '',
    payload.descricao_complementar_objeto ?? '',
    payload.observacao_operacional ?? '',
    payload.responsaveis?.[0]?.nome ?? '',
    payload.responsaveis?.[0]?.cargo ?? '',
    payload.responsaveis?.[0]?.email ?? '',
    payload.responsaveis?.[1]?.nome ?? '',
    payload.responsaveis?.[1]?.cargo ?? '',
    payload.responsaveis?.[1]?.email ?? '',
    payload.locais_execucao?.[0]?.logradouro ?? '',
    payload.locais_execucao?.[0]?.complemento ?? '',
    payload.locais_execucao?.[0]?.referencia ?? '',
    payload.distribuicao_profissoes?.[0]?.observacao ?? '',
    payload.distribuicao_profissoes?.[1]?.observacao ?? '',
    payload.distribuicao_profissoes?.[2]?.observacao ?? '',
    profissoes[0].nome,
    profissoes[1].nome,
    profissoes[2].nome,
  ].filter(Boolean);

  const pdfFields =
    template.codigo === 'PADRAO_ORGAO_PUBLICO_GDF'
      ? [
          payload.numero_contrato ?? '',
          payload.processo_sei ?? '',
          payload.doc_sei ?? '',
          payload.siggo_numero ?? '',
          formatDateBR(payload.data_inicio),
          representante?.nome ?? '',
          representante?.cargo ?? '',
          preposto?.nome ?? '',
          preposto?.cargo ?? '',
        ].filter(Boolean)
      : [
          empresa.razao_social,
          onlyDigits(empresa.cnpj),
          representante?.nome ?? '',
          representante?.cargo ?? '',
          preposto?.nome ?? '',
          preposto?.cargo ?? '',
        ].filter(Boolean);

  return {
    pdfFields,
    previewFields: previewFields.filter((field) => !field.includes('@playwright.test')),
  };
}

export async function prepareContratoConvenio(
  api: APIRequestContext,
  options: {
    index: number;
    seed: string;
    templateCode?: CodigoTemplateContrato;
  }
): Promise<PreparedContratoConvenio> {
  const [templates, tabelasProdutividade] = await Promise.all([
    listTemplateContratos(api),
    listTabelasProdutividade(api),
  ]);
  const template = pickTemplate(templates, options.templateCode);
  const tabelaProdutividade = tabelasProdutividade.find((tabela) => tabela.ativo);
  const profissoes = await ensureProfissoesContrato(api, `${options.seed}-${options.index}`);
  const empresaPayload = buildEmpresaPayload({
    mode: 'complete',
    seed: `${options.seed}-empresa-${options.index}`,
  });
  const empresa = await createEmpresa(api, empresaPayload);
  const marker = `PW-CONTRATO-${options.seed}-${options.index}`;
  const payload = buildConvenioPayload({
    empresa,
    index: options.index,
    marker,
    profissoes,
    tabelaProdutividade,
    template,
  });
  const convenio = await createEmpresaConvenio(api, payload);
  const expectedFields = buildExpectedFields({
    empresa,
    marker,
    payload,
    profissoes,
    template,
  });

  return {
    empresa,
    convenio,
    marker,
    payload,
    template,
    ...expectedFields,
  };
}

export async function prepareContratoConvenios(
  api: APIRequestContext,
  options: {
    count: number;
    seed: string;
    templateCode?: CodigoTemplateContrato;
  }
): Promise<PreparedContratoConvenio[]> {
  const prepared: PreparedContratoConvenio[] = [];

  for (let index = 0; index < options.count; index += 1) {
    prepared.push(
      await prepareContratoConvenio(api, {
        index,
        seed: options.seed,
        templateCode: options.templateCode,
      })
    );
  }

  return prepared;
}

export function expectContratoPreviewMatchesPayload(
  preview: ContratoPreviewDto,
  prepared: PreparedContratoConvenio
): void {
  const { payload, template } = prepared;
  const representantePayload = payload.responsaveis?.find(
    (responsavel) => responsavel.tipo === 'REPRESENTANTE_LEGAL'
  );
  const prepostoPayload = payload.responsaveis?.find(
    (responsavel) => responsavel.tipo === 'PREPOSTO_OPERACIONAL'
  );
  const representantePreview = preview.responsaveis.find(
    (responsavel) => responsavel.tipo === 'REPRESENTANTE_LEGAL'
  );
  const prepostoPreview = preview.responsaveis.find(
    (responsavel) => responsavel.tipo === 'PREPOSTO_OPERACIONAL'
  );

  expect(preview.convenio_id).toBe(prepared.convenio.convenio_id);
  expect(preview.template_codigo).toBe(template.codigo);
  expect(preview.empresa.razao_social).toBe(prepared.empresa.razao_social);
  expect(onlyDigits(preview.empresa.cnpj)).toBe(onlyDigits(prepared.empresa.cnpj));
  expect(preview.data_inicio).toBe(payload.data_inicio);
  expect(preview.data_fim).toBe(payload.data_fim);
  expect(preview.data_repactuacao).toBe(payload.data_repactuacao);
  expect(preview.numero_contrato).toBe(payload.numero_contrato);
  expect(preview.processo_sei).toBe(payload.processo_sei);
  expect(preview.doc_sei).toBe(payload.doc_sei);
  expect(preview.siggo_numero).toBe(payload.siggo_numero);
  expect(preview.percentual_gestao).toBe(payload.percentual_gestao);
  expect(preview.percentual_contrapartida).toBe(payload.percentual_contrapartida);
  expect(preview.observacao_juridica).toBe(payload.observacao_juridica);
  expect(preview.clausula_adicional).toBe(payload.clausula_adicional);
  expect(preview.descricao_complementar_objeto).toBe(payload.descricao_complementar_objeto);
  expect(preview.observacao_operacional).toBe(payload.observacao_operacional);
  expect(preview.remuneracao_beneficios.observacao_beneficio).toBe(payload.observacao_beneficio);
  expect(preview.bonus_produtividade_descricao).toBe(payload.bonus_produtividade_descricao);
  expect(preview.responsaveis).toHaveLength(payload.responsaveis?.length ?? 0);
  expect(representantePreview?.cargo).toBe(representantePayload?.cargo);
  expect(prepostoPreview?.cargo).toBe(prepostoPayload?.cargo);
  expect(preview.locais_execucao).toHaveLength(payload.locais_execucao?.length ?? 0);
  expect(preview.distribuicao_profissoes).toHaveLength(
    payload.distribuicao_profissoes?.length ?? 0
  );
}
