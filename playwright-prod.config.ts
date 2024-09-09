import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';

require('dotenv').config()

export default defineConfig<TestOptions>({
  use: {
    baseURL: 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
  },

  projects: [
    {
      name: 'chromium',
    },
  ],
});

// Note: In order to use this config file, you have to run the following from the command line:
// npx playwright test --config=chromium
