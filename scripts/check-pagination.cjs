const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
    const routes = ['/mens', '/mens?category=denim', '/mens?category=trousers', '/mens?category=sweaters', '/mens?category=boxers', '/womens', '/womens?category=leggings', '/womens?category=sweaters', '/womens?category=lingerie', '/girls', '/girls?category=denim', '/girls?category=sweaters'];
    for (const route of routes) {
      await page.goto(base + route);
      await page.locator('.language-selector select').selectOption('en');
      assert.ok(await page.locator('.catalog-sidebar').isVisible(), route + ': shared checkbox sidebar');
      assert.equal(await page.locator('.girls-dropdowns, .girls-swatches, .catalog-types').count(), 0);
      const size = page.locator('.catalog-page-size select');
      await size.selectOption('all');
      const allNames = await page.locator('.mens-product-info h2').allTextContents();
      await size.selectOption('3');
      const visited = [];
      for (let number = 1; ; number++) {
        assert.equal(await page.locator('.catalog-pagination [aria-current="page"]').textContent(), String(number));
        assert.ok(await page.locator('.mens-product-card').count() <= 3);
        visited.push(...await page.locator('.mens-product-info h2').allTextContents());
        const next = page.locator('.catalog-pagination > button').last();
        if (await next.isDisabled()) break;
        await next.click();
      }
      assert.deepEqual(visited, allNames, route + ': pages contain every product once');
      await page.locator('.catalog-sort select').selectOption('az');
      assert.equal(await page.locator('.catalog-pagination [aria-current="page"]').textContent(), '1', 'Sorting resets the page');
      await page.locator('.catalog-pagination > button').last().click();
      await page.locator('.catalog-sidebar input').first().check();
      assert.equal(await page.locator('.catalog-pagination [aria-current="page"]').textContent(), '1', 'Filtering resets the page');
      await page.locator('.catalog-sidebar .filter-heading button').click();
      await size.selectOption('all');
      assert.equal(await page.locator('.mens-product-card').count(), allNames.length, 'Clearing restores every product');
    }
    for (const locale of ['en', 'es', 'ja', 'de']) {
      await page.goto(base + '/girls');
      await page.locator('.language-selector select').selectOption(locale);
      await page.locator('.catalog-page-size select').selectOption('3');
      await page.locator('.catalog-pagination > button').last().click();
      assert.equal(await page.locator('.catalog-pagination [aria-current="page"]').textContent(), locale === 'ja' ? '二' : '2');
    }
    await page.setViewportSize({ width: 375, height: 812 });
    for (const route of ['/mens', '/womens', '/girls']) {
      await page.goto(base + route);
      assert.ok(await page.locator('.mobile-filter-button').isVisible());
      assert.ok(!(await page.locator('.catalog-sidebar').isVisible()));
      await page.locator('.mobile-filter-button').click();
      assert.ok(await page.locator('.mens-filter-dialog').isVisible());
      await page.locator('.mens-filter-dialog input').first().check();
      await page.locator('.filter-apply').click();
      assert.ok(await page.locator('.active-filters').isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + ': mobile layout fits');
    }
    assert.deepEqual(errors, []);
    console.log('12 catalog categories: pagination, page sizes, complete product coverage, filter/sort resets, four languages and mobile filters passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
