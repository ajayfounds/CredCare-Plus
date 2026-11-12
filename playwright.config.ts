import { defineConfig, devices } from '@playwright/test';

const PORT = 3010;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: 'audit/playwright.json' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
    hasTouch: false,
    isMobile: false,
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/home`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
