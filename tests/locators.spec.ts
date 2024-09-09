import test, { expect } from "@playwright/test";

test.beforeEach( async ({page}) => {
  await page.goto('/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Facing Locators', async ({page}) => {
  await page.getByRole('textbox', {name: 'Email'}).first().click()

  await page.getByLabel('Email').first().click()

  await page.getByPlaceholder('Jane Doe').click()

  await page.getByText('Using the Grid').click()

  await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async ({page}) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
  await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async ({page}) => {
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: "Email"}).click()

  await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: "Email"}).click()

  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})


test('Reusing the locatrs', async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const txtEmail = basicForm.getByRole('textbox', {name: "Email"})

  await txtEmail.fill('a@b.com')
  await basicForm.getByRole('textbox', {name: "Password"}).fill('password123')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(txtEmail).toHaveValue('a@b.com')
})

test('Extracting values', async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})

  // Single text value
  const btnSubmit = await basicForm.locator('button').textContent()
  expect(btnSubmit).toEqual('Submit')

  //all text values
  const rdbOptions = await page.locator('nb-radio').allTextContents()
  expect(rdbOptions).toContain('Option 1')

  //Input value
  const txtEmail = basicForm.getByRole('textbox', {name: 'Email'})
  await txtEmail.fill('x@y.com')
  const actualEmail = await txtEmail.inputValue()
  expect(actualEmail).toEqual('x@y.com')

  const actualPlaceHolder = await txtEmail.getAttribute('placeholder')
  expect(actualPlaceHolder).toEqual('Email')
})

test('Assertions', async ({page}) => {
  const btnSubmit = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

  //Generic assertions. Do es not require await
  const value = 5
  expect(value).toEqual(5)

  const text = await btnSubmit.textContent()
  expect(text).toEqual('Submit')

  //Locator Assertions. It requires await
  await expect(btnSubmit).toHaveText('Submit')

  //Soft Assertions
  await expect.soft(btnSubmit).toHaveText('Submit5')
  await btnSubmit.click()
})
