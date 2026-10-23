const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
    await page.goto(base);
    await page.locator('header .navigation > .button').click();
    assert.equal(new URL(page.url()).pathname, '/contact');
    for (const locale of ['en', 'es', 'ja', 'de']) {
      await page.goto(base + '/contact');
      await page.locator('.language-selector select').selectOption(locale);
      const dictionary = locale === 'en' ? {} : JSON.parse(fs.readFileSync(`src/i18n/${locale}.json`, 'utf8'));
      assert.equal(await page.locator('h1').textContent(), dictionary['Contact Us'] || 'Contact Us');
      assert.equal(await page.locator('form').evaluate(form => form.checkValidity()), false, 'Empty form cannot submit');
      await page.locator('#contact-name').fill('Test Customer');
      await page.locator('#contact-email').fill('customer@example.com');
      await page.locator('#contact-company').fill('Customer & Co');
      await page.locator('#contact-subject').fill('Apparel enquiry & samples');
      await page.locator('#contact-message').fill('Hello!\nPlease share sizes & pricing. 日本語');
      await page.locator('form button[type="submit"]').click();
      const href = await page.locator('.contact-draft a').getAttribute('href');
      const url = new URL(href);
      assert.equal(url.pathname, 'info@roann-sourcing.com');
      assert.equal(url.searchParams.get('subject'), 'Apparel enquiry & samples');
      const body = url.searchParams.get('body');
      for (const value of ['Test Customer', 'customer@example.com', 'Customer & Co', 'Hello!\nPlease share sizes & pricing. 日本語']) assert.ok(body.includes(value));
      await page.locator('#contact-message').fill('Updated enquiry');
      assert.equal(await page.locator('.contact-draft').count(), 0, 'Editing invalidates the old draft');
    }
    await page.setViewportSize({ width: 375, height: 812 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Form fits mobile screens');
    assert.deepEqual(errors, []);
    console.log('Contact navigation, four languages, required fields, email encoding, draft updates and mobile layout passed. No email was sent.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
