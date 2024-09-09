import { Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatePickerPage extends HelperBase{
 
  constructor(page: Page) {
    super(page)
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const txtCalendar = this.page.getByPlaceholder('Form Picker')
    await txtCalendar.click()
    const expectedDate = await this.selectDatePicker(numberOfDaysFromToday)
    await expect(txtCalendar).toHaveValue(expectedDate)
  }

  async selectDatePickerWithRange(startDayFromToday: number, endDayFromToday: number) {
    const txtCalendar = this.page.getByPlaceholder('Range Picker')
    await txtCalendar.click()
    const expectedStartDate = await this.selectDatePicker(startDayFromToday)
    const expectedEndDate = await this.selectDatePicker(endDayFromToday)
    const expectedDate = `${expectedStartDate} - ${expectedEndDate}`
    await expect(txtCalendar).toHaveValue(expectedDate)
  }

  private async selectDatePicker(numberOfDaysFromToday: number) {
    let date = new Date()
    date.setDate(date.getDate() + 500)
    const day = date.getDate().toString()
    const month = date.toLocaleString('EN-US', {month: "short"})
    const year = date.getFullYear().toString()
    const expectedDate = `${month} ${day}, ${year}`

    await this.page.locator('nb-calendar-view-mode').getByRole('button').click()
    await this.page.locator('nb-calendar-picker').getByText(year).click()
    await this.page.locator('nb-calendar-picker').getByText(month).click()
    await this.page.locator('.day-cell.ng-star-inserted').getByText(day, {exact: true}).click()
    return expectedDate
  }

}
