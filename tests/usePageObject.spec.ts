import test, { expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from '@faker-js/faker'

test.beforeEach(async({page}) => {
  await page.goto('/')
})

test('Navigate to form page @smoke @regression', async ({page}) => {
  const pm = new PageManager(page)
  await pm.navigateTo().formLayoutsPage()
  await pm.navigateTo().datePickerPage()
  await pm.navigateTo().smartTablePage()
  await pm.navigateTo().toastrPage()
  await pm.navigateTo().tooltipPage()
})

test('Parametrized methods @smoke', async ({page}) => {
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName({sex: "male"})
  const randomEmail = `${randomFullName.replace(' ', '').toLowerCase()}${faker.number.int(100)}@test.com`
  await pm.navigateTo().formLayoutsPage()
  await pm.onFormLayoutsPage().submitFormUsingTheGrid(process.env.USER, process.env.PASSWORD, 'Option 2')
  await page.screenshot({path: 'screenshots/formLayoutsPage.png'})
  const buffer = await page.screenshot() // You can use this when you want to share the binay later on to the stakeholders by using other platforms
  await pm.onFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, false)
  await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inLineForm.png'})
  await pm.navigateTo().datePickerPage()
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
  await pm.onDatePickerPage().selectDatePickerWithRange(5, 10)
})
