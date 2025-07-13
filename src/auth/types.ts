export type UserType = {
  usuario_id: string;
  nome: string;
  email: string;
  avatar_url: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
};

export type AuthState = {
  user: UserType | undefined;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType | undefined;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
