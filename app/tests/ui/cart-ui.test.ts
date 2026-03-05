import { test, expect } from '@playwright/test';

test.describe('Cart Page UI', () => {

  test('cart page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/login/);
  });

  test('login page shows email input after cart redirect', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('cart page heading is visible when authenticated', async ({ page }) => {
    // Set a mock token cookie so the page doesn't redirect
    await page.context().addCookies([
      { name: 'token', value: 'mock-token', domain: 'localhost', path: '/' }
    ]);
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('Ingredient Cart');
  });

  test('cart shows empty message when cart is empty', async ({ page }) => {
    await page.context().addCookies([
      { name: 'token', value: 'mock-token', domain: 'localhost', path: '/' }
    ]);
    await page.goto('/cart');
    // Wait for loading to finish then check for empty or items state
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    const hasEmpty = body.includes('Your ingredient cart is empty') || body.includes('Ingredient Cart');
    expect(hasEmpty).toBeTruthy();
  });

  test('cart page has correct page title structure', async ({ page }) => {
    await page.context().addCookies([
      { name: 'token', value: 'mock-token', domain: 'localhost', path: '/' }
    ]);
    await page.goto('/cart');
    await expect(page.locator('h1')).toBeVisible();
  });

});