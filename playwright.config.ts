import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
//import dotenv from 'dotenv'
require('dotenv').config()
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  expect: {
    timeout: 2000,
    //toMatchSnapshot: {maxDiffPixels: 50} // This is to configure globally the max difference in pixel for all the visual tests
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false, // Normally the value is true by default
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, // Normally the then option is 0
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      },
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    //['allure-playwright']
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: 'http://localhost:4200/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
        : process.env.STAGING === '1' ? 'http://localhost:4202/'
        : 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    // If you want to set video option you can configure it by the following:
    /* video: {
      mode: 'on',
      size: {
        width: 1920,
        height: 1080
      }
    } */
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       },
    },
    {
      name: 'staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://url-for-staging/'
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      //fullyParallel: true - This can be set in case you want to run this project in pararllel. This is usefull if you do not set the fullyParallel option as global
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro'],
        video: 'on'
      }
    },
  ],

  webServer: {
    timeout: 120000,
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
});
