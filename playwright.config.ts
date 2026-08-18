import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',

  use: {
    baseURL: 'http://localhost:4000'
  },

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4000',
    reuseExistingServer: true
  }
});
