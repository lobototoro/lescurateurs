import { test, expect } from './baseFixtures';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBe('Create Next App');
  });

  test('should have a header', async ({ page }) => {
    const header = await page.locator('h1');
    expect(await header.textContent()).toBe('LES CURATEURS');
  });
});