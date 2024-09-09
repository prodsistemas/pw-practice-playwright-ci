import test, { expect } from "@playwright/test";

test.beforeEach( async ({page}, testInfo) => {
  await page.goto(process.env.URL)
  await page.getByRole('button').click()
  testInfo.setTimeout(testInfo.timeout + 2000) // This is one way to increment the timeout for all the tests in the suite
})

test('Timeouts', async ({page}) => {
  //test.setTimeout(10000) // This will set the test timeout by providing the value as argument
  test.slow() // This increase by 3x the test timeout
  const lblSuccess = page.locator('.bg-success')
  await lblSuccess.click()
})
