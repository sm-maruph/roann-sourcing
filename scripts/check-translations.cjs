const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const routes = ['/', '/about', '/products', '/mens', '/womens', '/girls', '/compliance'];
    for (const locale of ['es', 'ja', 'de', 'en']) {
      const dictionary = locale === 'en' ? {} : JSON.parse(fs.readFileSync(path.join(__dirname, `../src/i18n/${locale}.json`), 'utf8'));
      for (const route of routes) {
        await page.goto(base + route);
        await page.locator('.language-selector select').selectOption(locale);
        await page.waitForFunction(code => document.documentElement.lang === code, locale);
        const contact = page.locator('header .navigation > .button');
        await assert.doesNotReject(() => contact.waitFor());
        assert.equal(await contact.textContent(), locale === 'en' ? 'Contact Us' : dictionary['Contact Us']);
        assert.equal(await page.locator('.language-selector select').inputValue(), locale);
        if (route === '/' || route === '/about') {
          const heading = locale === 'en' ? 'Your apparel sourcing partner' : dictionary['Your apparel sourcing partner'];
          assert.equal(await page.getByRole('heading', { name: heading, exact: true }).count(), 1, 'Apparel heading is correctly translated');
          assert.ok(!(await page.locator('main').innerText()).includes('Appairal'), 'Misspelling never appears in translated content');
          assert.equal(await page.locator('.stats strong').first().textContent(), locale === 'ja' ? '二十二以上' : '22+', 'Statistics use localized numbers');
          if (route === '/') assert.equal(await page.locator('.step-number').first().textContent(), locale === 'ja' ? '一' : '01', 'Process steps use localized numbers');
        }
        if (locale !== 'en') assert.ok(!(await page.locator('main').innerText()).includes('Your next collection starts here.'));
      }
      await page.goto(base + '/girls');
      assert.equal(await page.locator('.language-selector select').inputValue(), locale, 'Preference persists between pages');
      const filter = page.locator('.catalog-sidebar input[id="catalog-Fabric-Cotton-Jersey"]');
      await filter.check();
      assert.equal(await page.locator('.mens-product-card').count(), 2, 'Translated fabric option retains the filter value');
      await page.locator('.mens-product-image').first().click();
      await page.locator('input[name="name"]').fill('Test Buyer');
      await page.locator('textarea[name="message"]').fill('My custom requirement');
      await page.locator('.language-selector select').evaluate((select, value) => {
        select.value = value; select.dispatchEvent(new Event('change', { bubbles: true }));
      }, locale === 'en' ? 'de' : 'en');
      assert.equal(await page.locator('input[name="name"]').inputValue(), 'Test Buyer');
      assert.equal(await page.locator('textarea[name="message"]').inputValue(), 'My custom requirement');
      await page.locator('.mens-quote-dialog .dialog-close').click();
      await page.locator('.language-selector select').selectOption(locale);
      await page.reload();
      assert.equal(await page.locator('.language-selector select').inputValue(), locale, 'Preference persists after reload');
      console.log(`${locale}: 7 pages, filters, quote form, language switching and persistence passed`);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    for (const locale of ['en', 'es', 'ja', 'de']) {
      await page.goto(base + '/');
      await page.locator('.language-selector select').selectOption(locale);
      await page.locator('.menu-toggle').click();
      assert.ok(await page.locator('.navigation').evaluate(element => element.scrollWidth <= element.clientWidth + 1), 'Mobile menu fits');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile page fits');
    }
    assert.deepEqual(errors, [], 'No browser errors');
    console.log('Mobile checks passed. No browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
