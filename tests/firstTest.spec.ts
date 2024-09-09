import test from "@playwright/test";

test.beforeEach( async ({page}) => {
  await page.goto('/')
})

test.describe('Suite 1', () => {

  test('Navigate to the Forms', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('Navigate to the Datepickers', async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
  })

})

test.describe('Suite 2', () => {

  test('Navigate to the Forms', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('Navigate to the Datepickers', async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
  })

})
