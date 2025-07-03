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
