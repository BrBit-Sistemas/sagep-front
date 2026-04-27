import { type BodyType, customInstance } from '../../lib/axios';

export type TempoNaFila = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

export type MatchCriterioTelao = {
  chave: string;
  label: string;
  ok: boolean;
  detalhe?: string;
};

export type FilaItemTelao = {
  posicao: number;
  detento_id: string;
  nome: string;
  prontuario?: string | null;
  dias_na_fila: TempoNaFila;
  status_visual: 'ELEGIVEL' | 'BLOQUEADO' | 'SEM_VAGA';
  motivo_resumo: string;
  vagas_elegiveis_count?: number;
};

export type ReeducandoDetalheTelao = {
  detento_id: string;
  ficha_id: string;
  nome: string;
  prontuario?: string | null;
  posicao_fila: number;
  profissoes_texto: string;
  regime: string;
  unidade: string;
  escolaridade: string;
  artigo_resumo: string;
  dias_na_fila: TempoNaFila;
  ficha_cadastro_em: string;
  experiencias_tags: string[];
};

export type VagaTelao = {
  convenio_vaga_id: string;
  convenio_id: string;
  empresa_id: string;
  empresa_nome: string;
  profissao_id: string;
  profissao_nome: string;
  nivel: string | null;
  titulo_exibicao: string;
  local_resumo: string | null;
  valor_referencia: number | null;
  quantidade_total: number;
  quantidade_preenchida: number;
  quantidade_reservada: number;
  quantidade_disponivel: number;
  elegivel: boolean;
  score: number;
  criterios: MatchCriterioTelao[];
};

export type IndicadoresTelao = {
  total_vagas_linhas: number;
  elegiveis: number;
  alertas: number;
  inelegiveis: number;
  posicao_destaque: number;
};

export type EmpresaOpcaoTelao = { id: string; razao_social: string };

export type TelaoVagasFilaResponse = {
  titulo: string;
  regra_funap_texto: string;
  indicadores: IndicadoresTelao;
  empresas_com_vagas: EmpresaOpcaoTelao[];
  fila: FilaItemTelao[];
  selecionado: ReeducandoDetalheTelao | null;
  vagas: VagaTelao[];
  progresso_texto: string;
};

export type TelaoHistoricoItem = {
  telao_fila_evento_id: string;
  tipo: string;
  detento_id: string;
  convenio_vaga_id?: string | null;
  justificativa?: string | null;
  created_at: string;
};

export type TelaoQueryParams = {
  empresa_id?: string;
  detento_id?: string;
};

export const getTelaoVagasFila = () => {
  const base = '/fila-vagas';

  const getTelao = (params?: TelaoQueryParams, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<TelaoVagasFilaResponse>(
      { url: `${base}/telao`, method: 'GET', params },
      options
    );

  const historico = (
    params?: { detento_id?: string; convenio_vaga_id?: string; limit?: number },
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<TelaoHistoricoItem[]>(
      { url: `${base}/historico`, method: 'GET', params },
      options
    );

  const pular = (
    body: BodyType<{
      detento_id: string;
      convenio_vaga_id?: string;
      justificativa: string;
    }>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<void>(
      {
        url: `${base}/pular`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  const reservar = (
    body: BodyType<{ detento_id: string; convenio_vaga_id: string }>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<void>(
      {
        url: `${base}/reservar`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  const alocar = (
    body: BodyType<{ detento_id: string; convenio_vaga_id: string }>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<void>(
      {
        url: `${base}/alocar`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  return { getTelao, historico, pular, reservar, alocar };
};
