import { test, expect } from '@playwright/test';

// Configurações do admin - credenciais fixas
const ADMIN_EMAIL = 'admin@boilerplate.com';
const ADMIN_PASSWORD = 'admin123';

test.describe('Autenticação - Login', () => {
  test('deve fazer login com sucesso usando o usuário admin', async ({ page }) => {
    // Navega para a página de login
    await page.goto('/pt-BR/login');

    // Verifica se está na página de login
    await expect(page).toHaveURL(/\/login$/);

    // Aguarda a página carregar completamente
    await page.waitForSelector('input[name="login"]', { timeout: 10000 });

    console.log('📝 Preenchendo credenciais...');

    // Preenche o campo de login
    await page.fill('input[name="login"]', ADMIN_EMAIL);

    // Preenche o campo de senha
    await page.fill('input[name="password"]', ADMIN_PASSWORD);

    // Tira screenshot antes de submeter (para debug)
    await page.screenshot({ path: 'tests/screenshots/before-login.png' });

    console.log('🔑 Fazendo login...');

    // Clica no botão de login
    await page.click('button[type="submit"]');

    // Aguarda o redirecionamento para o dashboard
    console.log('⏳ Aguardando redirecionamento...');
    await page.waitForURL(/\/dashboard$/, { timeout: 30000 });

    // Verifica se foi redirecionado corretamente
    await expect(page).toHaveURL(/\/dashboard$/);

    console.log('✅ Redirecionado para o dashboard!');

    // Verifica se algum elemento do dashboard está visível
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });

    // Tira screenshot do dashboard (para confirmar sucesso)
    await page.screenshot({ path: 'tests/screenshots/dashboard-after-login.png' });

    console.log('✅ Login realizado com sucesso!');
  });
});
