import { AxiosError } from 'axios';

// ----------------------------------------------------------------------

export function getErrorMessage(error: unknown): string {
  // Handle Axios errors specifically
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    // Handle 401 Unauthorized
    if (status === 401) {
      return 'CPF ou senha incorretos. Verifique suas credenciais e tente novamente.';
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      return 'Acesso negado. Você não tem permissão para realizar esta ação.';
    }
    
    // Handle 404 Not Found
    if (status === 404) {
      return 'Recurso não encontrado. Verifique se a URL está correta.';
    }
    
    // Handle 500 Internal Server Error
    if (status === 500) {
      return 'Erro interno do servidor. Tente novamente em alguns minutos.';
    }
    
    // Handle other HTTP errors
    if (status && status >= 400) {
      return responseData?.message || `Erro ${status}: ${error.message}`;
    }
    
    // Handle network errors
    if (!error.response) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    
    // Handle other Axios errors
    return responseData?.message || error.message || 'Erro de comunicação com o servidor.';
  }

  // Handle regular Error instances
  if (error instanceof Error) {
    return error.message || error.name || 'Ocorreu um erro inesperado';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle object errors
  if (typeof error === 'object' && error !== null) {
    const errorMessage = (error as { message?: string }).message;
    if (typeof errorMessage === 'string') {
      return errorMessage;
    }
  }

  return 'Erro desconhecido. Tente novamente.';
}
