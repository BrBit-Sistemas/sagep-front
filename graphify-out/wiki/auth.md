# Auth

← [index](index.md) · [features](features.md) · [routes](routes.md) · [api](api.md) · [hooks](hooks.md) · [flows](flows.md)

96 nós em `src/auth/`. Estratégia JWT com `AuthContext` + `AuthProvider` + guards (`AuthGuard`, `GuestGuard`, `PermissionGuard`).

## Fluxo de login

```
JwtSignInView → signInWithPassword()  → POST /auth/login
                ↓
                setSession(token)      → salva em STORAGE_KEY + injeta no axios
                ↓
                AuthContext.checkUserSession()  → GET /auth/me → preenche usuário
                ↓
                AuthGuard libera rotas protegidas
```

## Guards

- **AuthGuard** — bloqueia se `!user`; redireciona para `/auth/jwt/sign-in` preservando `returnTo`.
- **GuestGuard** — inverso; usado em rotas públicas (`/auth/*`).
- **PermissionGuard** — verifica permissão CASL-like via `usePermissionCheck()`.

## Arquivos

### `src/auth/components/`

- `form-divider.tsx` — `src/auth/components/form-divider.tsx`
- `FormDivider()` — `src/auth/components/form-divider.tsx`
- `FormDivider component` — `src/auth/components/form-divider.tsx`
- `form-head.tsx` — `src/auth/components/form-head.tsx`
- `FormHead component` — `src/auth/components/form-head.tsx`
- `form-resend-code.tsx` — `src/auth/components/form-resend-code.tsx`
- `FormResendCode()` — `src/auth/components/form-resend-code.tsx`
- `FormResendCode component` — `src/auth/components/form-resend-code.tsx`
- `form-return-link.tsx` — `src/auth/components/form-return-link.tsx`
- `FormReturnLink()` — `src/auth/components/form-return-link.tsx`
- `FormReturnLink component` — `src/auth/components/form-return-link.tsx`
- `form-socials.tsx` — `src/auth/components/form-socials.tsx`
- `FormSocials()` — `src/auth/components/form-socials.tsx`
- `FormSocials` — `src/auth/components/form-socials.tsx`
- `sign-up-terms.tsx` — `src/auth/components/sign-up-terms.tsx`
- `SignUpTerms()` — `src/auth/components/sign-up-terms.tsx`
- `SignUpTerms` — `src/auth/components/sign-up-terms.tsx`

### `src/auth/context/`

- `auth-context.tsx` — `src/auth/context/auth-context.tsx`
- `AuthContext (React context)` — `src/auth/context/auth-context.tsx`
- `action.ts` — `src/auth/context/jwt/action.ts`
- `signInWithPassword()` — `src/auth/context/jwt/action.ts`
- `signUp()` — `src/auth/context/jwt/action.ts`
- `signOut()` — `src/auth/context/jwt/action.ts`
- `forgotPassword()` — `src/auth/context/jwt/action.ts`
- `resetPassword()` — `src/auth/context/jwt/action.ts`
- `signInWithPassword action` — `src/auth/context/jwt/action.ts`
- `signUp action` — `src/auth/context/jwt/action.ts`
- `signOut action` — `src/auth/context/jwt/action.ts`
- `forgotPassword action` — `src/auth/context/jwt/action.ts`
- `resetPassword action` — `src/auth/context/jwt/action.ts`
- `auth-provider.tsx` — `src/auth/context/jwt/auth-provider.tsx`
- `AuthProvider()` — `src/auth/context/jwt/auth-provider.tsx`
- `AuthProvider (JWT)` — `src/auth/context/jwt/auth-provider.tsx`
- `constant.ts` — `src/auth/context/jwt/constant.ts`
- `JWT_STORAGE_KEY constant` — `src/auth/context/jwt/constant.ts`
- `index.ts` — `src/auth/context/jwt/index.ts`
- `JWT context barrel index` — `src/auth/context/jwt/index.ts`
- `utils.ts` — `src/auth/context/jwt/utils.ts`
- `jwtDecode()` — `src/auth/context/jwt/utils.ts`
- `isValidToken()` — `src/auth/context/jwt/utils.ts`
- `tokenExpired()` — `src/auth/context/jwt/utils.ts`
- `setSession()` — `src/auth/context/jwt/utils.ts`
- `jwtDecode util` — `src/auth/context/jwt/utils.ts`
- `isValidToken util` — `src/auth/context/jwt/utils.ts`
- `tokenExpired util` — `src/auth/context/jwt/utils.ts`
- `setSession util` — `src/auth/context/jwt/utils.ts`

### `src/auth/guard/`

- `PermissionGuard` — `src/auth/guard`
- `AuthGuard` — `src/auth/guard`
- `GuestGuard` — `src/auth/guard`
- `PermissionGuard` — `src/auth/guard`
- `auth-guard.tsx` — `src/auth/guard/auth-guard.tsx`
- `AuthGuard()` — `src/auth/guard/auth-guard.tsx`
- `AuthGuard` — `src/auth/guard/auth-guard.tsx`
- `guest-guard.tsx` — `src/auth/guard/guest-guard.tsx`
- `GuestGuard()` — `src/auth/guard/guest-guard.tsx`
- `GuestGuard` — `src/auth/guard/guest-guard.tsx`
- `index.ts` — `src/auth/guard/index.ts`
- `Guards barrel index` — `src/auth/guard/index.ts`
- `usePermissionCheck` — `src/auth/guard/permission-guard`
- `usePermissionCheck` — `src/auth/guard/permission-guard`
- `permission-guard.tsx` — `src/auth/guard/permission-guard.tsx`
- `PermissionGuard()` — `src/auth/guard/permission-guard.tsx`
- `usePermissionCheck()` — `src/auth/guard/permission-guard.tsx`
- `PermissionGuard` — `src/auth/guard/permission-guard.tsx`
- `usePermissionCheck hook` — `src/auth/guard/permission-guard.tsx`
- `usePermissionCheck (RBAC)` — `src/auth/guard/permission-guard.tsx`
- `PermissionGuard / usePermissionCheck` — `src/auth/guard/permission-guard.tsx`
- `role-based-guard.tsx` — `src/auth/guard/role-based-guard.tsx`
- `RoleBasedGuard()` — `src/auth/guard/role-based-guard.tsx`
- `RoleBasedGuard` — `src/auth/guard/role-based-guard.tsx`

### `src/auth/hooks/`

- `index.ts` — `src/auth/hooks/index.ts`
- `Auth hooks barrel` — `src/auth/hooks/index.ts`
- `useAuthContext hook` — `src/auth/hooks/use-auth-context`
- `use-auth-context.ts` — `src/auth/hooks/use-auth-context.ts`
- `useAuthContext()` — `src/auth/hooks/use-auth-context.ts`
- `useAuthContext hook` — `src/auth/hooks/use-auth-context.ts`
- `use-mocked-user.ts` — `src/auth/hooks/use-mocked-user.ts`
- `useMockedUser()` — `src/auth/hooks/use-mocked-user.ts`
- `useMockedUser hook` — `src/auth/hooks/use-mocked-user.ts`

### `src/auth/types.ts/`

- `types.ts` — `src/auth/types.ts`
- `Auth types (UserType, AuthState, AuthContextValue)` — `src/auth/types.ts`

### `src/auth/utils/`

- `error-message.ts` — `src/auth/utils/error-message.ts`
- `getErrorMessage()` — `src/auth/utils/error-message.ts`
- `getErrorMessage helper` — `src/auth/utils/error-message.ts`
- `index.ts` — `src/auth/utils/index.ts`
- `Auth utils barrel` — `src/auth/utils/index.ts`

### `src/auth/view/`

- `JwtSignInView` — `src/auth/view/jwt`
- `JwtSignUpView` — `src/auth/view/jwt`
- `index.ts` — `src/auth/view/jwt/index.ts`
- `JWT view barrel index` — `src/auth/view/jwt/index.ts`
- `jwt-sign-in-view.tsx` — `src/auth/view/jwt/jwt-sign-in-view.tsx`
- `JwtSignInView` — `src/auth/view/jwt/jwt-sign-in-view.tsx`
- `SignInSchema (zod)` — `src/auth/view/jwt/jwt-sign-in-view.tsx`
- `jwt-sign-up-view.tsx` — `src/auth/view/jwt/jwt-sign-up-view.tsx`
- `JwtSignUpView` — `src/auth/view/jwt/jwt-sign-up-view.tsx`
- `SignUpSchema (zod)` — `src/auth/view/jwt/jwt-sign-up-view.tsx`
