import { test, expect } from '@playwright/test';

// Função helper para gerar email único
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `test-user-${timestamp}@test.com`;
}

test.describe('Autenticação - Cadastro', () => {
  test('deve criar uma nova conta com sucesso', async ({ page }) => {
    // Navega para a página de cadastro
    await page.goto('/pt-BR/signup');

    // Verifica se está na página de cadastro
    await expect(page).toHaveURL(/\/signup$/);

    console.log('📝 Preenchendo formulário de cadastro...');

    // Aguarda a página carregar
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });

    // Gera dados únicos para o teste
    const uniqueEmail = generateUniqueEmail();
    const testName = `Test User ${Date.now()}`;
    const testPassword = 'TestPassword123!';

    // Preenche o nome
    await page.fill('input[name="name"]', testName);

    // Preenche o email
    await page.fill('input[name="email"]', uniqueEmail);

    // Preenche a senha
    await page.fill('input[name="password"]', testPassword);

    // Tira screenshot antes de submeter
    await page.screenshot({ path: 'tests/screenshots/before-signup.png' });

    console.log(`📧 Criando conta com email: ${uniqueEmail}`);

    // Clica no botão de cadastro
    await page.click('button[type="submit"]');

    console.log('⏳ Aguardando redirecionamento...');

    // Aguarda um pouco para a requisição processar
    await page.waitForTimeout(2000);

    // Verifica a URL atual
    const currentUrl = page.url();
    console.log(`📍 URL após signup: ${currentUrl}`);

    // Aguarda redirecionamento para página de verificação de email
    await page.waitForURL(/\/email-verification/, { timeout: 10000 });

    console.log('✅ Redirecionado para página de verificação!');

    // Verifica que foi redirecionado para email-verification com o email na URL
    await expect(page).toHaveURL(/\/email-verification\?email=/);

    // Verifica que o email está na URL
    console.log(`📍 URL final: ${page.url()}`);
    expect(page.url()).toContain(encodeURIComponent(uniqueEmail));

    // Tira screenshot da página de verificação
    await page.screenshot({ path: 'tests/screenshots/email-verification-page.png' });

    console.log('✅ Conta criada com sucesso!');
  });

  test('deve validar campos obrigatórios no cadastro', async ({ page }) => {
    // Navega para a página de cadastro
    await page.goto('/pt-BR/signup');

    console.log('🧪 Testando validação de campos...');

    // Aguarda o formulário carregar
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });

    // Tenta submeter sem preencher nada
    await page.click('button[type="submit"]');

    // Aguarda um pouco para verificar se ainda está na mesma página
    await page.waitForTimeout(1000);

    // Verifica que ainda está na página de cadastro
    await expect(page).toHaveURL(/\/signup$/);

    console.log('✅ Validação funcionando - campos obrigatórios sendo verificados');
  });

  test('deve navegar de volta para login', async ({ page }) => {
    // Navega para a página de cadastro
    await page.goto('/pt-BR/signup');

    // Aguarda a página carregar
    await page.waitForSelector('text=Login', { timeout: 10000 });

    // Clica no link para voltar ao login
    await page.click('text=Login');

    // Verifica redirecionamento para login
    await page.waitForURL(/\/login$/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login$/);

    console.log('✅ Navegação para login funcionando');
  });

  test('deve mostrar erro ao tentar cadastrar com email duplicado', async ({ page }) => {
    // Usa o email do admin que já existe
    const existingEmail = 'admin@boilerplate.com';

    // Navega para a página de cadastro
    await page.goto('/pt-BR/signup');

    console.log('🧪 Testando cadastro com email duplicado...');

    // Aguarda o formulário carregar
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });

    // Preenche com email que já existe
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', existingEmail);
    await page.fill('input[name="password"]', 'TestPassword123!');

    // Clica no botão de cadastro
    await page.click('button[type="submit"]');

    // Aguarda mensagem de erro
    await page.waitForSelector('[data-sonner-toast]', { timeout: 10000 });

    // Verifica que ainda está na página de cadastro
    await expect(page).toHaveURL(/\/signup$/);

    // Tira screenshot do erro
    await page.screenshot({ path: 'tests/screenshots/signup-duplicate-email-error.png' });

    console.log('✅ Erro de email duplicado exibido corretamente');
  });
});
