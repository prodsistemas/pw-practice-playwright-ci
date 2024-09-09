import { test } from '../test-options'
import { PageManager } from "../page-objects/pageManager";
import { faker } from '@faker-js/faker'

test('Parametrized methods', async ({pageManager}) => {
  const randomFullName = faker.person.fullName({sex: "male"})
  const randomEmail = `${randomFullName.replace(' ', '').toLowerCase()}${faker.number.int(100)}@test.com`

  await pageManager.onFormLayoutsPage().submitFormUsingTheGrid(process.env.USER, process.env.PASSWORD, 'Option 2')
  await pageManager.onFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, false)
})
