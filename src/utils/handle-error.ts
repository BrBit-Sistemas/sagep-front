import { AxiosError } from 'axios';

export const handleError = (error: unknown): string => {
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

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocorreu um erro desconhecido';
};

export interface FieldError {
  field: string;
  message: string;
}

export const extractFieldErrors = (error: unknown): FieldError[] => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;

    // Handle validation errors from class-validator (NestJS standard format)
    if (responseData?.message && Array.isArray(responseData.message)) {
      return responseData.message.map((err: any) => ({
        field: err.property || err.field || 'unknown',
        message: err.message || 'Campo inválido',
      }));
    }

    // Handle custom error format with errors array
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      return responseData.errors.map((err: any) => ({
        field: err.field || 'unknown',
        message: err.message || 'Campo inválido',
      }));
    }

    // Handle single error message
    if (responseData?.message && typeof responseData.message === 'string') {
      // Try to map common error messages to specific fields
      const message = responseData.message;
      if (message.includes('CPF')) {
        return [{ field: 'cpf', message }];
      }
      if (message.includes('Prontuário') || message.includes('prontuário')) {
        return [{ field: 'prontuario', message }];
      }
      if (message.includes('nome')) {
        return [{ field: 'nome', message }];
      }
      if (message.includes('data')) {
        return [{ field: 'data_nascimento', message }];
      }
      if (message.includes('regime')) {
        return [{ field: 'regime', message }];
      }
      if (message.includes('escolaridade')) {
        return [{ field: 'escolaridade', message }];
      }
      if (message.includes('unidade')) {
        return [{ field: 'unidade_id', message }];
      }
      // User-specific field mappings
      if (message.includes('email')) {
        return [{ field: 'email', message }];
      }
      if (message.includes('senha') || message.includes('password')) {
        return [{ field: 'senha', message }];
      }
      if (message.includes('confirmar') || message.includes('confirm')) {
        return [{ field: 'confirmarSenha', message }];
      }
      if (message.includes('secretaria')) {
        return [{ field: 'secretariaId', message }];
      }
      if (message.includes('regional')) {
        return [{ field: 'regionalId', message }];
      }
      if (message.includes('unidade')) {
        return [{ field: 'unidadeId', message }];
      }
    }
  }

  return [];
};
