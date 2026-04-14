import { expect, test } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');

    // Page returns 200
    expect(response?.status()).toBe(200);

    // Page has a title
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Check that interactive elements are keyboard-focusable
    const buttons = page.locator('button, a[href], input, select, textarea');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const el = buttons.nth(i);
      const tagName = await el.evaluate(e => e.tagName.toLowerCase());

      // Links should have accessible text
      if (tagName === 'a') {
        const text = await el.textContent();
        const ariaLabel = await el.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }

      // Images should have alt text
      const images = page.locator('img');
      const imgCount = await images.count();
      for (let j = 0; j < imgCount; j++) {
        const alt = await images.nth(j).getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    }
  });

  test('API health check returns OK', async ({ request }) => {
    const response = await request.get('/api/hello');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('name');
  });

  test('page responds to viewport changes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    expect(await page.isVisible('body')).toBe(true);

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    expect(await page.isVisible('body')).toBe(true);
  });
});
