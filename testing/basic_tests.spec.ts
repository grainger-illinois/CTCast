import { expect, test, request, chromium } from '@playwright/test'
import { 
  clickMenuItemById,
  findLatestBuild, 
  ipcMainCallFirstListener, 
  ipcRendererCallFirstListener, 
  parseElectronApp,
  ipcMainInvokeHandler,
  ipcRendererInvoke
  
} from 'electron-playwright-helpers'

import React from 'react'
import { EventEmitter } from 'node:events'
import { BrowserContext, ElectronApplication, Page, _electron as electron } from 'playwright'
import { BrowserNotSupported, MessageSharp } from '@mui/icons-material'
import LinkEncoder from '../src/components/LinkEncoder'
import { LinkEncoderAPI } from '../src/api'

let electronApp: ElectronApplication

test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild()
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild)
  // set the CI environment variable to true
  //process.env.CI = 'e2e'
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable
  })
  electronApp.on('window', async (page) => {
    const filename = page.url()?.split('/').pop()
    console.log(`Window opened: ${filename}`)

    // capture errors
    page.on('pageerror', (error) => {
      console.error(error)
    })
    // capture console messages
    page.on('console', (msg) => {
      console.log(msg.text())
    })
  })

})

test.afterAll(async () => {
  await electronApp.close()
})

let page: Page




// test('autogentest', async ({ page }) => {
//   await electronApp.firstWindow()
//   await page.getByRole('button', { name: 'Link Encoder' }).click();
//   await expect(page).toHaveURL('http://localhost:3000/main_window#/linkencoder');
//   await page.getByLabel('IP Address').click();
//   await page.getByLabel('IP Address').fill('127.0.0.1');
//   await page.getByLabel('Port').click();
//   await page.getByLabel('Port').fill('10002');
//   await page.getByRole('button', { name: 'Connect' }).click();
//   await page.getByLabel('Message').click();
//   await page.getByLabel('Message').fill('This is a test');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   await page.getByRole('button', { name: 'Clear' }).click();
//   await page.getByRole('button', { name: 'Home' }).click();
//   await expect(page).toHaveURL('http://localhost:3000/main_window#/');
//   await page.getByRole('button', { name: 'Zoom' }).click();
//   await expect(page).toHaveURL('http://localhost:3000/main_window#/zoom');
//   await page.getByRole('button', { name: 'File Upload' }).click();
//   await expect(page).toHaveURL('http://localhost:3000/main_window#/uploadfiles');
//   //await page.waitForSelector('h1')
//   const text = await page.$eval('h1', (el) => el.textContent)
//   // expect(text).toBe('File Upload')
// });


// test('Reads Text', async () => {


//   page = await electronApp.firstWindow()
//   const [frame] = await Promise.all([
//     page.waitForEvent('framenavigated'),
//     page.locator('a:has-text("Link Encoder")').click()
//   ]);

//   const ipAd = frame.locator('label:has-text("IP Address")')

//   const port = frame.locator('label:has-text("Port")')

//   const messageBox = frame.locator('label:has-text("Message")')

//   await frame.locator('button:has-text("Clear")').click()
//   await ipAd.type('127.0.0.1')
//   await port.type('10002')
//   console.log(await messageBox.inputValue())
//   await messageBox.type("hello")
//   const s2 = await messageBox.inputValue()
//   expect(s2).toBe("hello")
//   const r = frame.locator('button:has-text("Submit")')
//   await r.click()



//   //await window.linkEncoderAPI.sendToLinkEncoder(postData.caption);
//   // const response = await request.post()
//   //await (frame.waitForTimeout(2000))
//   //console.log('done')
 
// })


test('renders the home page', async () => {
  page = await electronApp.firstWindow()
  //await page.waitForNavigation()
  await page.waitForSelector('h1')
  //await page.waitForSelector('h1')
  const text = await page.$eval('h1', (el) => el.textContent)
  expect(text).toBe('Welcome to CTCast')
  const title = await page.title()
  expect(title).toBe('CTCast')
})


test('renders the zoom page', async () => {
  page = await electronApp.firstWindow()
  console.log(page.title())
  const [window] = await Promise.all([
    page.waitForEvent('framenavigated'),
    page.locator('a:has-text("Zoom")').click()
  ]);
  await window.waitForSelector('h1')
  const text = await page.$eval('h1', (el) => el.textContent)
  expect(text).toBe('Zoom')
  page = window.page()
})


test('renders the link encoder page', async () => {
  page = await electronApp.firstWindow()
  const [window] = await Promise.all([
    page.waitForEvent('framenavigated'),
    page.locator('a:has-text("Link Encoder")').click()
  ]);
  await window.waitForSelector('h1')
  const text = await page.$eval('h1', (el) => el.textContent)
  expect(text).toBe('Link Encoder')
  page = window.page()
})


test('Sends Text Correctly', async () => {
  page = await electronApp.firstWindow()
  const [window] = await Promise.all([
    page.waitForEvent('framenavigated'),
    page.locator('a:has-text("Link Encoder")').click()
  ]);

  const ipAd = window.locator('label:has-text("IP Address")')

  const port = window.locator('label:has-text("Port")')

  const messageBox = window.locator('label:has-text("Message")')

  await window.locator('button:has-text("Clear")').click()
  await ipAd.type('127.0.0.1')
  await port.type('10002')
  await window.locator('button:has-text("Connect")').click()
  //console.log(await messageBox.inputValue())
  await messageBox.type("hello")
  const s2 = await messageBox.inputValue()
  expect(s2).toBe("hello")
  const r = window.locator('button:has-text("Submit")')
  await r.click()
  //await (window.waitForTimeout(2000))
  //console.log('done')
 
})


test('renders the shortcut page', async () => {
  page = await electronApp.firstWindow()
  const [window] = await Promise.all([
    page.waitForEvent('framenavigated'),
    page.locator('a:has-text("Shortcuts")').click()
  ]);
  await window.waitForSelector('h1')
  const text = await page.$eval('h1', (el) => el.textContent)
  expect(text).toBe('Shortcuts')
  page = window.page()
})


test('renders the help page', async () => {
  page = await electronApp.firstWindow()
  const [window] = await Promise.all([
    page.waitForEvent('framenavigated'),
    page.locator('a[href="#/help"]').click()
    //page.locator('id=help').click()
  ]);
  await window.waitForSelector('h1')
  const text = await page.$eval('h1', (el) => el.textContent)
  expect(text).toBe('Captioned Enhanced Audio Descriptions Best Practices')
  page = window.page()
})

test('Correctly returns to home page', async () => {
  page = await electronApp.firstWindow()
  const [window] = await Promise.all([
    page.waitForEvent('framenavigated'),
    page.locator('a:has-text("Home")').click()
  ]);
  await window.waitForSelector('h1')
  const text = await page.$eval('h1', (el) => el.textContent)
  expect(text).toBe('Welcome to CTCast')
  page = window.page()
})


