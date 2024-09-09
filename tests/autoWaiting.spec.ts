import test, { expect } from "@playwright/test";

test.beforeEach( async ({page}) => {
  await page.goto(process.env.URL)
  await page.getByRole('button').click()
})

test('Auto waiting for methods', async ({page}) => {
  const lblSuccess = page.locator('.bg-success')
  await lblSuccess.waitFor({state: "attached"}) // It is necessary to add this code in order to wait for allTextContents method
  //Some methods does not wait before are executed. See the playwright documentation in the utowaiting topic
  const expectedText = await lblSuccess.allTextContents() // allTextContents does not wait. It is just executed. For that reason it is needed to add a waitFor method.

  expect(expectedText).toContain('Data loaded with AJAX get request.')
})

test('Auto waiting for locators', async ({page}) => {
  const lblSuccess = page.locator('.bg-success')

  await expect(lblSuccess).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}) // It needs to add timeout object because waiting for locators is set by default in 5 seconds and time response it takes 15 seconds
})

test('Alternative auto waiting for element', async ({page}) => {
  const lblSuccess = page.locator('.bg-success')

  await page.waitForSelector('.bg-success')
  const expectedText = await lblSuccess.allTextContents()

  expect(expectedText).toContain('Data loaded with AJAX get request.')
})

test.skip('Alternative auto waiting for a particular response', async ({page}) => {
  const lblSuccess = page.locator('.bg-success')

  await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
  const expectedText = await lblSuccess.allTextContents()

  expect(expectedText).toContain('Data loaded with AJAX get request.')
})

test.skip('Alternative auto waiting for network calls to be completed (NOT RECOMMENDED)', async ({page}) => {
  const lblSuccess = page.locator('.bg-success')

  await page.waitForLoadState('networkidle')
  const expectedText = await lblSuccess.allTextContents()

  expect(expectedText).toContain('Data loaded with AJAX get request.')
})
