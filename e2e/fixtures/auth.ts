import type { APIRequestContext } from '@playwright/test';

import { expect, test as base } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3000';
const ADMIN_CPF = process.env.PLAYWRIGHT_ADMIN_CPF ?? '11144477735';
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? 'admin@sagep';

type AuthFixtures = {
  adminToken: string;
  authenticatedApi: APIRequestContext;
};

export const test = base.extend<AuthFixtures>({
  adminToken: [
    async ({ playwright }, use) => {
      const authRequest = await playwright.request.newContext();
      const response = await authRequest.post(`${API_BASE_URL}/auth/login`, {
        data: {
          cpf: ADMIN_CPF,
          senha: ADMIN_PASSWORD,
        },
      });

      expect(response.ok()).toBeTruthy();

      const body = (await response.json()) as { accessToken?: string };

      if (!body.accessToken) {
        throw new Error('Nao foi possivel obter o accessToken do login Playwright.');
      }

      await use(body.accessToken);
      await authRequest.dispose();
    },
    { scope: 'worker' },
  ],
  authenticatedApi: [
    async ({ playwright, adminToken }, use) => {
      const api = await playwright.request.newContext({
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      await use(api);
      await api.dispose();
    },
    { scope: 'worker' },
  ],
  context: async ({ context, adminToken }, use) => {
    await context.addInitScript((token: string) => {
      window.localStorage.setItem('accessToken', token);
      window.localStorage.setItem('jwt_access_token', token);
      window.sessionStorage.setItem('jwt_access_token', token);
    }, adminToken);

    await use(context);
  },
});

export { expect } from '@playwright/test';
export const playwrightApiBaseUrl = API_BASE_URL;
