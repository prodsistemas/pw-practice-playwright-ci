import test, { expect } from "@playwright/test";

test.describe.configure({mode: "parallel"})

test.beforeEach(async({page}) => {
  await page.goto('/')
})

test.describe('Form Layouts page @block', () => {
  test.describe.configure({retries: 2}) // This is usefull when you want to overwrite the retry configuration
  test.describe.configure({mode: "serial"}) // This will run the tests inside the group of tests in sequential mode

  test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('Input fields', async ({page}, testInfo) => {
    if(testInfo.retry) {
      //Put the code you want here when the test is flaky
    }
    const txtEmail = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})
    await txtEmail.fill('test@test.com')
    await txtEmail.clear()
    await txtEmail.pressSequentially('test2@test.com', {delay: 100})

    //Generic assertions
    const actualValue = await txtEmail.inputValue()
    expect(actualValue).toEqual('test2@test.com')

    //Locator assertion
    await expect(txtEmail).toHaveValue('test2@test.com')
  })

  test('Radio buttons', async ({page}) => {
    const gridForm = page.locator('nb-card', {hasText: 'Using the Grid'})
    //await gridForm.getByLabel('Option 1').check({force: true})
    await gridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
    const rdbStatus = await gridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
    expect(rdbStatus).toBeTruthy()
    await expect(gridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

    await gridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
    expect(await gridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
    expect(await gridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
  })

})

test('Checkboxes', async ({page}) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Toastr').click()

  await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
  await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})

  const allCheckboxes = page.getByRole('checkbox');
  for(const box of await allCheckboxes.all()) {
    // To check checkbox
    await box.check({force: true})
    expect(await box.isChecked()).toBeTruthy()
    // To uncheck checkbox
    await box.uncheck({force: true})
    expect(await box.isChecked()).toBeFalsy()
  }
})

test('Lists and Dropdowns', async ({page}) => {
  const dropDownMenu = page.locator('ngx-header nb-select')
  await dropDownMenu.click()

  page.getByRole('list') // When the list has a UL tag
  page.getByRole('listitem') // When the list has LI tag

  const optionList = page.locator('nb-option-list nb-option')
  await expect(optionList).toHaveText(['Light','Dark', 'Cosmic', 'Corporate'])
  await optionList.filter({hasText: "Cosmic"}).click()
  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  const colors = {
    "Light": "rgb(255, 255, 255)",
    "Dark": "rgb(34, 43, 69)",
    "Cosmic": "rgb(50, 50, 89)",
    "Corporate": "rgb(255, 255, 255)"
  }

  for(const color in colors) {
    await dropDownMenu.click()
    await optionList.filter({hasText: color}).click()
    await expect(header).toHaveCSS('background-color', colors[color])
  }
})

test('Tooltips', async ({page}) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  const tooltipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
  await tooltipCard.getByRole('button', {name: 'Top'}).hover()

  page.getByRole('tooltip') // If you have a role tooltip created
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toEqual('This is a tooltip')
})

test('Dialog box', async ({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })

  await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Web tables', async ({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  // 1 get the row by any text in the target row
  const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
  await targetRow.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')
  await page.locator('.nb-checkmark').click()

  // 2  get the row based on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
  const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
  await targetRowById.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

  // Using headers to define the cell to modify
  const headers = await page.locator('thead tr').nth(0).getByRole('cell').allInnerTexts()
  const targetRowByHeaderIndex = page.getByRole('row').filter({has: page.locator('td').nth(headers.indexOf('ID')).getByText('12')})
  await targetRowByHeaderIndex.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test2@test2.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowByHeaderIndex.locator('td').nth(headers.indexOf('E-mail'))).toHaveText('test2@test2.com')

  // 3 Test filter of the table
  const ages = ['20', '30', '40', '200']

  for(let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500)

    const rows = page.locator('tbody tr')

    for(let row of await rows.all()) {
      const actualAge = await row.locator('td').last().textContent()

      if(age == '200') {
        expect(await page.locator('tbody').textContent()).toContain('No data found')
      } else {
        expect(actualAge).toEqual(age)
      }

    }

  }
})

test('Datepickers', async ({page}) => {
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  const txtCalendar = page.getByPlaceholder('Form Picker')
  await txtCalendar.click()

  let date = new Date()
  date.setDate(date.getDate() + 500)
  const day = date.getDate().toString()
  const month = date.toLocaleString('EN-US', {month: "short"})
  const year = date.getFullYear().toString()

  const expectedDate = `${month} ${day}, ${year}`

  await page.locator('nb-calendar-view-mode').getByRole('button').click()
  await page.locator('nb-calendar-picker').getByText(year).click()
  await page.locator('nb-calendar-picker').getByText(month).click()
  await page.locator('[class="day-cell ng-star-inserted"]').getByText(day, {exact: true}).click()

  await expect(txtCalendar).toHaveValue(expectedDate)
})

test('Sliders', async ({page}) => {
  // Update attribute
  const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  await tempGauge.evaluate( node => {
    node.setAttribute('cx','232.630')
    node.setAttribute('cy','232.630')
  })
  await tempGauge.click()

  // Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await tempBox.scrollIntoViewIfNeeded()

  const box = await tempBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y)
  await page.mouse.move(x + 100, y + 100)
  await page.mouse.up()
  await expect(tempBox).toContainText('30')
})
