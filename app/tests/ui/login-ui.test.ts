import { test, expect } from '@playwright/test';

test.describe('Login Page UI', () => {

  test('login page loads successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
  });

  test('email input is visible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('password input is visible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('sign in button is visible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('create one link navigates to register', async ({ page }) => {
    await page.goto('/login');
    await page.locator('text=Create one').click();
    await expect(page).toHaveURL(/register/);
  });

});