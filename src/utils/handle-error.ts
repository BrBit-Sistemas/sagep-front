import { AxiosError } from 'axios';

export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof AxiosError) {
    return error.response?.data.message;
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
    }
  }

  return [];
};
