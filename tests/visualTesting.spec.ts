import test, { expect } from "@playwright/test";

test.only('Radio buttons', async ({page}) => {
  await page.goto('/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
  const gridForm = page.locator('nb-card', {hasText: 'Using the Grid'})
  await gridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
  await gridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
  await expect(gridForm).toHaveScreenshot()
  //await expect(gridForm).toHaveScreenshot({maxDiffPixels: 250})
})

