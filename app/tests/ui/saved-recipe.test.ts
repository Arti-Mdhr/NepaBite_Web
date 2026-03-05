import { test, expect } from '@playwright/test';

test.describe('Saved Recipes Page UI', () => {

  test('saved-recipes redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/saved-recipes');
    await expect(page).toHaveURL(/login/);
  });

  test('login page shows password input after saved-recipes redirect', async ({ page }) => {
    await page.goto('/saved-recipes');
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login page shows email input after saved-recipes redirect', async ({ page }) => {
    await page.goto('/saved-recipes');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('login page shows sign in button after saved-recipes redirect', async ({ page }) => {
    await page.goto('/saved-recipes');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login page shows Namaste heading after saved-recipes redirect', async ({ page }) => {
    await page.goto('/saved-recipes');
    await expect(page.locator('h2')).toContainText('Namaste');
  });

});