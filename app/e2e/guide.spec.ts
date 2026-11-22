import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { window.localStorage.setItem('premier-geste:auto', '0') } catch {}
  })
})

test('home → cardiac arrest → step 3 → rhythm → next → back', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.h-brand')).toHaveText('First Aid')
  await expect(page.locator('.h-tile')).toHaveCount(8)

  await page.locator('.h-tile').filter({ hasText: 'Cardiac arrest' }).click()
  await expect(page).toHaveURL(/#\/guide\/rcp\/1$/)
  await expect(page.locator('.a-count b')).toHaveText('01')

  await page.locator('.a-prog i').nth(2).click()
  await expect(page).toHaveURL(/#\/guide\/rcp\/3$/)
  await expect(page.locator('.a-count b')).toHaveText('03')
  await expect(page.locator('.a-t')).toContainText('Push hard and fast')
  await expect(page.locator('.a-prog i.on')).toHaveCount(3)

  await page.locator('.a-metro').click()
  await expect(page.locator('.screen.guide')).toHaveClass(/is-metro/)
  await expect(page.locator('.a-metro')).toContainText('Stop rhythm')

  await page.locator('.a-next').click()
  await expect(page).toHaveURL(/#\/guide\/rcp\/4$/)
  await expect(page.locator('.screen.guide')).not.toHaveClass(/is-metro/)
  await expect(page.locator('.a-metro')).toHaveCount(0)

  await page.locator('.a-top a').click()
  await expect(page.locator('.h-brand')).toBeVisible()
})

test('the call button is present on every emergency screen', async ({ page }) => {
  for (const hash of ['#/', '#/guide/rcp/1', '#/guide/brul/4', '#/appel', '#/fiches', '#/fiches/rcp']) {
    await page.goto('/' + hash)
    const call = page.locator('a.a-call')
    await expect(call).toBeVisible()
    await expect(call).toHaveAttribute('href', 'tel:15')
  }
})

test('call page: numbers, 114 as SMS and location on click', async ({ page }) => {
  await page.goto('/#/appel')
  await expect(page.locator('.c-num[href="tel:15"]')).toContainText('EMS')
  await expect(page.locator('.c-num[href="tel:18"]')).toContainText('Fire brigade')
  await expect(page.locator('.c-num[href="tel:112"]')).toContainText('European emergency')
  await expect(page.locator('.c-num[href="sms:114"]')).toContainText('deaf and hard of hearing')
  await expect(page.locator('.c-say li')).toHaveCount(4)
  await expect(page.locator('.c-pos')).toBeHidden()

  await page.context().grantPermissions(['geolocation'])
  await page.context().setGeolocation({ latitude: 48.8566, longitude: 2.3522 })
  await page.locator('.c-geo').click()
  await expect(page.locator('.c-pos')).toBeVisible()
  await expect(page.locator('.c-pos-val')).toContainText('48.85660')
  await expect(page.locator('.c-pos-val')).toContainText('2.35220')
})

test('fact sheets: 8 entries, demo notice, audio per step', async ({ page }) => {
  await page.goto('/#/fiches')
  await expect(page.locator('.f-row')).toHaveCount(8)
  await expect(page.locator('.f-demo')).toContainText('Demonstration')
  await expect(page.locator('.f-foot')).toContainText('PSC1')
  await page.locator('.f-row').filter({ hasText: 'Burn' }).click()
  await expect(page).toHaveURL(/#\/fiches\/brul$/)
  await expect(page.locator('.f-step')).toHaveCount(4)
  await expect(page.locator('.f-step-audio')).toHaveCount(4)
  await expect(page.locator('.f-step-no s')).toHaveCount(3)
})

test('reload: the URL restores the same step', async ({ page }) => {
  await page.goto('/#/guide/etouf/3')
  await expect(page.locator('.a-count b')).toHaveText('03')
  await expect(page.locator('.a-t')).toContainText('5 abdominal thrusts')
  await page.reload()
  await expect(page.locator('.a-count b')).toHaveText('03')
})

test('audio file and auto-read persisted', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      if (!window.sessionStorage.getItem('auto-seeded')) {
        window.localStorage.setItem('premier-geste:auto', '1')
        window.sessionStorage.setItem('auto-seeded', '1')
      }
    } catch {}
  })
  const audioRequests: string[] = []
  page.on('request', request => {
    if (request.url().includes('/audio/')) audioRequests.push(request.url())
  })
  await page.goto('/#/guide/rcp/1')
  await expect(page.locator('.a-auto')).toContainText('on')
  await expect.poll(() => audioRequests.some(url => url.includes('rcp-1.mp3'))).toBe(true)

  await page.locator('.a-next').click()
  await expect.poll(() => audioRequests.some(url => url.includes('rcp-2.mp3'))).toBe(true)

  await page.locator('.a-auto').click()
  await expect(page.locator('.a-auto')).toContainText('Auto read')
  expect(await page.evaluate(() => window.localStorage.getItem('premier-geste:auto'))).toBe('0')
  await page.reload()
  await expect(page.locator('.a-auto')).not.toContainText('on')
})

test('works offline after a first visit', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.locator('.h-brand')).toBeVisible()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.goto('/#/guide/rcp/3')
  await expect(page.locator('.a-count b')).toHaveText('03')
  await expect(page.locator('.a-t')).toContainText('Push hard and fast')
  await expect(page.locator('a.a-call')).toHaveAttribute('href', 'tel:15')
})

test('swipe and arrow keys change steps', async ({ page }) => {
  await page.goto('/#/guide/rcp/2')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.a-count b')).toHaveText('03')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('.a-count b')).toHaveText('02')
})
