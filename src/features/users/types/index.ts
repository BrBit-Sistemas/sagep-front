import type { ReadUsuarioDto } from 'src/api/generated.schemas';

export type User = ReadUsuarioDto;

export type UserListParams = {
  page: number;
  limit: number;
  search?: string;
};
