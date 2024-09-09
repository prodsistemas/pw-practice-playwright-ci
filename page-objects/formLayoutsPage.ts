import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase {

  constructor(page: Page) {
    super(page)
  }

  async submitFormUsingTheGrid(email: string, password: string, optionText: string) {
    const formLayout = this.page.locator('nb-card', {hasText: 'Using the Grid'})
    await formLayout.getByRole('textbox', {name: 'Email'}).fill(email)
    await formLayout.getByRole('textbox', {name: 'Password'}).fill(password)
    await formLayout.getByRole('radio', {name: optionText}).check({force: true})
    await formLayout.getByRole('button').click()
  }

  /**
   * This method fill the inline form
   * @param name - Name and last name of the person
   * @param email - valid email of the person
   * @param rememberMe - boolean value
   */
  async submitInlineForm(name: string, email: string, rememberMe: boolean) {
    const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'})
    await inlineForm.getByRole('textbox', {name: 'Jane Doe'}).fill(name)
    await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email)
    if(rememberMe)
      await inlineForm.getByRole('checkbox', {name: 'Remember me'}).check({force: true})
    await inlineForm.getByRole('button').click()
  }
}
