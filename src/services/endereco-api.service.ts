import { CONFIG } from 'src/global-config';

const DEBUG_CEP = import.meta.env.VITE_DEBUG_CEP === 'true';
const debugLog = (...args: unknown[]) => {
  if (DEBUG_CEP) {
    console.log('[CEP][FRONT]', ...args);
  }
};

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  ibge?: string;
}

export interface Estado {
  id: string;
  nome: string;
  sigla: string;
}

export interface Municipio {
  id: string;
  nome: string;
  estado_id: string;
  estado_sigla?: string;
}

class EnderecoApiService {
  private baseUrl = `${CONFIG.serverUrl}/api/enderecos`;

  /**
   * Busca informações de endereço por CEP
   */
  async buscarCep(cep: string): Promise<CepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }

    const url = `${this.baseUrl}/cep/${cepLimpo}`;
    debugLog('GET', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      debugLog('RESP ERROR', response.status, response.statusText);
      if (response.status === 404) {
        throw new Error(`CEP ${cepLimpo} não encontrado`);
      }
      throw new Error('Erro ao consultar CEP');
    }

    const data = await response.json();
    debugLog('RESP OK', { cep: data?.cep, cidade: data?.cidade, estado: data?.estado });
    return data;
  }

  /**
   * Lista todos os estados brasileiros
   */
  async listarEstados(): Promise<Estado[]> {
    const url = `${this.baseUrl}/estados`;
    debugLog('GET', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      debugLog('RESP ERROR', response.status, response.statusText);
      throw new Error('Erro ao listar estados');
    }

    const data = await response.json();
    debugLog('RESP OK', `estados=${Array.isArray(data) ? data.length : 0}`);
    return data;
  }

  /**
   * Lista municípios de um estado específico
   */
  async listarMunicipiosPorEstado(estadoId: string): Promise<Municipio[]> {
    const url = `${this.baseUrl}/municipios/${estadoId}`;
    debugLog('GET', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      debugLog('RESP ERROR', response.status, response.statusText);
      if (response.status === 404) {
        throw new Error(`Estado ${estadoId} não encontrado`);
      }
      throw new Error('Erro ao listar municípios');
    }

    const data = await response.json();
    debugLog('RESP OK', `municipios=${Array.isArray(data) ? data.length : 0}`, `uf=${estadoId}`);
    return data;
  }

  /**
   * Busca CEPs por endereço (busca reversa)
   */
  async buscarCepPorEndereco(params: {
    uf: string;
    cidade: string;
    logradouro?: string;
  }): Promise<CepResponse[]> {
    const queryParams = new URLSearchParams({
      uf: params.uf,
      cidade: params.cidade,
      ...(params.logradouro && { logradouro: params.logradouro }),
    });

    const url = `${this.baseUrl}/cep/buscar?${queryParams}`;
    debugLog('GET', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      debugLog('RESP ERROR', response.status, response.statusText);
      if (response.status === 404) {
        return []; // Nenhum resultado encontrado
      }
      throw new Error(`Erro ao buscar CEPs: ${response.statusText}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : [];
    debugLog('RESP OK', `count=${list.length}`, {
      sample: list[0] ? { cep: list[0].cep, logradouro: list[0].logradouro } : null,
    });
    return list;
  }
}

export const enderecoApiService = new EnderecoApiService();
