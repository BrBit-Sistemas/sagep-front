import { defineConfig } from '@playwright/test';

delete process.env.NO_COLOR;

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3030';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: '{testDir}/../.snapshots/{testFilePath}/{arg}{ext}',
  use: {
    baseURL,
    viewport: { width: 1440, height: 1200 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
