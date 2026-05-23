import { Page, expect } from '@playwright/test';

/**
 * Helper para fazer login com usuário
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  await page.fill('input[name="login"]', email);
  await page.fill('input[name="password"]', password);
  
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento para dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

/**
 * Helper para fazer logout
 */
export async function logout(page: Page) {
  // Clicar no menu do usuário
  await page.click('[aria-label="User menu"]');
  
  // Clicar em "Sair"
  await page.click('text=Sair');
  
  // Aguardar redirecionamento para login
  await page.waitForURL('**/login');
}

/**
 * Gera um email único para testes
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}@test.com`;
}

/**
 * Gera um nome único para testes
 */
export function generateUniqueName(prefix: string = 'Test'): string {
  const timestamp = Date.now();
  return `${prefix} ${timestamp}`;
}

/**
 * Aguarda um toast de sucesso aparecer
 */
export async function waitForSuccessToast(page: Page, message?: string) {
  if (message) {
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: message })).toBeVisible({ timeout: 5000 });
  } else {
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Aguarda um toast de erro aparecer
 */
export async function waitForErrorToast(page: Page, message?: string) {
  if (message) {
    await expect(page.locator('[data-sonner-toast]').filter({ hasText: message })).toBeVisible({ timeout: 5000 });
  } else {
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Fecha todos os toasts
 */
export async function closeAllToasts(page: Page) {
  const toasts = page.locator('[data-sonner-toast]');
  const count = await toasts.count();
  
  for (let i = 0; i < count; i++) {
    const closeButton = toasts.nth(i).locator('button');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}

/**
 * Preenche um formulário de criação de usuário
 */
export async function fillUserForm(page: Page, data: {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
  active?: boolean;
}) {
  await page.fill('input[name="name"]', data.name);
  await page.fill('input[name="email"]', data.email);
  await page.fill('input[name="password"]', data.password);
  
  if (data.admin !== undefined) {
    const adminCheckbox = page.locator('input[name="admin"]');
    const isChecked = await adminCheckbox.isChecked();
    if (data.admin !== isChecked) {
      await adminCheckbox.click();
    }
  }
  
  if (data.active !== undefined) {
    const activeCheckbox = page.locator('input[name="active"]');
    const isChecked = await activeCheckbox.isChecked();
    if (data.active !== isChecked) {
      await activeCheckbox.click();
    }
  }
}
