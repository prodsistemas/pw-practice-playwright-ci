import test from "@playwright/test";

test('Input fields @mobile', async ({page}, testInfo) => {
  await page.goto('/')
  if(testInfo.project.name == 'mobile') {
    await page.locator('.sidebar-toggle').click()
  }
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
  if(testInfo.project.name == 'mobile') {
    await page.locator('.sidebar-toggle').click()
  }
  const txtEmail = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})
  await txtEmail.fill('test@test.com')
})
