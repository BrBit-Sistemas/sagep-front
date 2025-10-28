import { CONFIG } from 'src/global-config';

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

    const response = await fetch(`${this.baseUrl}/cep/${cepLimpo}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`CEP ${cepLimpo} não encontrado`);
      }
      throw new Error('Erro ao consultar CEP');
    }

    return response.json();
  }

  /**
   * Lista todos os estados brasileiros
   */
  async listarEstados(): Promise<Estado[]> {
    const response = await fetch(`${this.baseUrl}/estados`);
    
    if (!response.ok) {
      throw new Error('Erro ao listar estados');
    }

    return response.json();
  }

  /**
   * Lista municípios de um estado específico
   */
  async listarMunicipiosPorEstado(estadoId: string): Promise<Municipio[]> {
    const response = await fetch(`${this.baseUrl}/municipios/${estadoId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Estado ${estadoId} não encontrado`);
      }
      throw new Error('Erro ao listar municípios');
    }

    return response.json();
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

    const response = await fetch(`${this.baseUrl}/cep/buscar?${queryParams}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return []; // Nenhum resultado encontrado
      }
      throw new Error(`Erro ao buscar CEPs: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
}

export const enderecoApiService = new EnderecoApiService();
