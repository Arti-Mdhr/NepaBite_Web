import { test, expect } from '@playwright/test';

test.describe('Register Page UI', () => {

  test('register page loads successfully', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/register/);
  });

  test('full name input is visible', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[placeholder="Jane Doe"]')).toBeVisible();
  });

  test('email input is visible', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('password input is visible', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('sign in link navigates back to login', async ({ page }) => {
    await page.goto('/register');
    await page.locator('text=Sign in').click();
    await expect(page).toHaveURL(/login/);
  });

});