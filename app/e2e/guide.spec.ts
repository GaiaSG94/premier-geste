import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { window.localStorage.setItem('premier-geste:auto', '0') } catch {}
  })
})

test('accueil → arrêt cardiaque → étape 3 → rythme → suivant → retour', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.h-brand')).toHaveText('Premier Geste')
  await expect(page.locator('.h-tile')).toHaveCount(8)

  await page.locator('.h-tile').filter({ hasText: 'Arrêt cardiaque' }).click()
  await expect(page).toHaveURL(/#\/guide\/rcp\/1$/)
  await expect(page.locator('.a-count b')).toHaveText('01')

  await page.locator('.a-prog i').nth(2).click()
  await expect(page).toHaveURL(/#\/guide\/rcp\/3$/)
  await expect(page.locator('.a-count b')).toHaveText('03')
  await expect(page.locator('.a-t')).toContainText('Massez fort et vite')
  await expect(page.locator('.a-prog i.on')).toHaveCount(3)

  await page.locator('.a-metro').click()
  await expect(page.locator('.screen.guide')).toHaveClass(/is-metro/)
  await expect(page.locator('.a-metro')).toContainText('Stop rythme')

  await page.locator('.a-next').click()
  await expect(page).toHaveURL(/#\/guide\/rcp\/4$/)
  await expect(page.locator('.screen.guide')).not.toHaveClass(/is-metro/)
  await expect(page.locator('.a-metro')).toHaveCount(0)

  await page.locator('.a-top a').click()
  await expect(page.locator('.h-brand')).toBeVisible()
})

test('le bouton d’appel est présent sur chaque écran du parcours', async ({ page }) => {
  for (const hash of ['#/', '#/guide/rcp/1', '#/guide/brul/4', '#/appel', '#/fiches', '#/fiches/rcp']) {
    await page.goto('/' + hash)
    const call = page.locator('a.a-call')
    await expect(call).toBeVisible()
    await expect(call).toHaveAttribute('href', 'tel:15')
  }
})

test('appel : numéros, 114 en SMS et position au clic', async ({ page }) => {
  await page.goto('/#/appel')
  await expect(page.locator('.c-num[href="tel:15"]')).toContainText('SAMU')
  await expect(page.locator('.c-num[href="tel:18"]')).toContainText('Pompiers')
  await expect(page.locator('.c-num[href="tel:112"]')).toContainText('Urgence européenne')
  await expect(page.locator('.c-num[href="sms:114"]')).toContainText('sourds et malentendants')
  await expect(page.locator('.c-say li')).toHaveCount(4)
  await expect(page.locator('.c-pos')).toBeHidden()

  await page.context().grantPermissions(['geolocation'])
  await page.context().setGeolocation({ latitude: 48.8566, longitude: 2.3522 })
  await page.locator('.c-geo').click()
  await expect(page.locator('.c-pos')).toBeVisible()
  await expect(page.locator('.c-pos-val')).toContainText('48.85660')
  await expect(page.locator('.c-pos-val')).toContainText('2.35220')
})

test('fiches : 8 entrées, démo, audio par étape', async ({ page }) => {
  await page.goto('/#/fiches')
  await expect(page.locator('.f-row')).toHaveCount(8)
  await expect(page.locator('.f-demo')).toContainText('démonstration')
  await expect(page.locator('.f-foot')).toContainText('PSC1')
  await page.locator('.f-row').filter({ hasText: 'Brûlure' }).click()
  await expect(page).toHaveURL(/#\/fiches\/brul$/)
  await expect(page.locator('.f-step')).toHaveCount(4)
  await expect(page.locator('.f-step-audio')).toHaveCount(4)
  await expect(page.locator('.f-step-no s')).toHaveCount(3)
})

test('rechargement : l’URL reprend la même étape', async ({ page }) => {
  await page.goto('/#/guide/etouf/3')
  await expect(page.locator('.a-count b')).toHaveText('03')
  await expect(page.locator('.a-t')).toContainText('5 compressions')
  await page.reload()
  await expect(page.locator('.a-count b')).toHaveText('03')
})

test('audio fichier, lecture auto mémorisée', async ({ page }) => {
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
  await expect(page.locator('.a-auto')).toContainText('activée')
  await expect.poll(() => audioRequests.some(url => url.includes('rcp-1.mp3'))).toBe(true)

  await page.locator('.a-next').click()
  await expect.poll(() => audioRequests.some(url => url.includes('rcp-2.mp3'))).toBe(true)

  await page.locator('.a-auto').click()
  await expect(page.locator('.a-auto')).toContainText('Lecture auto')
  expect(await page.evaluate(() => window.localStorage.getItem('premier-geste:auto'))).toBe('0')
  await page.reload()
  await expect(page.locator('.a-auto')).not.toContainText('activée')
})

test('fonctionne en mode avion après une première visite', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.locator('.h-brand')).toBeVisible()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.goto('/#/guide/rcp/3')
  await expect(page.locator('.a-count b')).toHaveText('03')
  await expect(page.locator('.a-t')).toContainText('Massez fort et vite')
  await expect(page.locator('a.a-call')).toHaveAttribute('href', 'tel:15')
})

test('balayage et flèches changent d’étape', async ({ page }) => {
  await page.goto('/#/guide/rcp/2')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.a-count b')).toHaveText('03')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('.a-count b')).toHaveText('02')
})
