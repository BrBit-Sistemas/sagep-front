# Variáveis de Ambiente

Este documento descreve as variáveis de ambiente utilizadas no projeto SAGEP Front.

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

### API e Assets

```env
# URL do servidor backend
VITE_SERVER_URL=http://localhost:3000

# Diretório de assets para builds de produção (opcional)
VITE_ASSETS_DIR=
```

### Ficha Cadastral

```env
# URL pública para acesso externo à ficha cadastral
# Esta URL será exibida na página de informações da ficha cadastral
# IMPORTANTE: Não inclua o protocolo (http:// ou https://) - será adicionado automaticamente
VITE_PUBLIC_FICHA_CADASTRAL_URL=df.sagep.com.br
# Exemplo para desenvolvimento local:
# VITE_PUBLIC_FICHA_CADASTRAL_URL=localhost:3030
```

### Mapbox (Opcional)

```env
# Chave de API do Mapbox para funcionalidades de mapa
VITE_MAPBOX_API_KEY=
```

### Autenticação Firebase (Opcional)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APPID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Autenticação AWS Amplify (Opcional)

```env
VITE_AWS_AMPLIFY_USER_POOL_ID=
VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID=
VITE_AWS_AMPLIFY_REGION=
```

### Autenticação Auth0 (Opcional)

```env
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CALLBACK_URL=
```

### Autenticação Supabase (Opcional)

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Valores Padrão

Se uma variável não for definida, os seguintes valores padrão serão utilizados:

- `VITE_SERVER_URL`: `http://localhost:3000`
- `VITE_PUBLIC_FICHA_CADASTRAL_URL`: `df.sagep.com.br`
- Demais variáveis: string vazia

## Notas

- As variáveis de ambiente são carregadas em tempo de build pelo Vite
- Para alterar uma variável, é necessário reiniciar o servidor de desenvolvimento
- Nunca commite o arquivo `.env` no repositório (ele já está no `.gitignore`)

