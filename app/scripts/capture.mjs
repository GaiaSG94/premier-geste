import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const baseDir = path.resolve(appDir, '..')
const reports = path.join(appDir, 'reports')
const origin = 'http://127.0.0.1:4174'

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(origin + '/')
      if (r.ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error('Serveur de prévisualisation indisponible')
}

async function capturePage(browser, route, name) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    try { window.localStorage.setItem('premier-geste:auto', '0') } catch {}
  })
  await page.goto(origin + '/' + route)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(reports, name + '.png') })
  await context.close()
}

async function capturePlanche(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } })
  const page = await context.newPage()
  const file = path.join(baseDir, 'G-DESIGN', 'planches', 'planche-A-bandeau.html')
  await page.goto(pathToFileURL(file).href)
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.phone').first().screenshot({ path: path.join(reports, 'planche-A-phone.png') })
  await context.close()
}

async function compose(browser) {
  const context = await browser.newContext({ viewport: { width: 900, height: 920 } })
  const page = await context.newPage()
  const left = 'data:image/png;base64,' + (await readFile(path.join(reports, 'planche-A-phone.png'))).toString('base64')
  const right = 'data:image/png;base64,' + (await readFile(path.join(reports, 'guide-rcp3.png'))).toString('base64')
  await page.setContent(`<body style="margin:0;background:#161616;display:flex;gap:20px;justify-content:center;padding:20px;font:600 14px system-ui;color:#fff">
    <figure style="margin:0"><figcaption style="padding:0 0 8px">PLANCHE A (référence)</figcaption><img src="${left}" style="width:390px;display:block"></figure>
    <figure style="margin:0"><figcaption style="padding:0 0 8px">APP — #/guide/rcp/3</figcaption><img src="${right}" style="width:390px;display:block"></figure>
  </body>`)
  await page.screenshot({ path: path.join(reports, 'comparaison-guide.png'), fullPage: true })
  await context.close()
}

const viteBin = path.join(appDir, 'node_modules', 'vite', 'bin', 'vite.js')
const server = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], {
  cwd: appDir,
  stdio: 'ignore',
})
let browser
try {
  await mkdir(reports, { recursive: true })
  await waitForServer()
  browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  })
  await capturePage(browser, '#/', 'accueil')
  await capturePage(browser, '#/guide/rcp/3', 'guide-rcp3')
  await capturePage(browser, '#/guide/brul/4', 'guide-brul4')
  await capturePage(browser, '#/appel', 'appel')
  await capturePage(browser, '#/fiches', 'fiches')
  await capturePage(browser, '#/fiches/rcp', 'fiche-rcp')
  await capturePlanche(browser)
  await compose(browser)
  await writeFile(path.join(reports, 'captures.txt'),
    ['accueil.png', 'guide-rcp3.png', 'guide-brul4.png', 'appel.png', 'fiches.png', 'fiche-rcp.png',
      'planche-A-phone.png', 'comparaison-guide.png'].join('\n') + '\n')
  console.log('Screenshots generated in ' + reports)
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
}
