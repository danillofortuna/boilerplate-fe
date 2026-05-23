import { defineConfig, devices } from '@playwright/test';

// Detectar se estamos no CI
const isCI = process.env.CI === 'true';

export default defineConfig({
  testDir: './tests/e2e',
  
  // Roda testes em paralelo (mas com cuidado para isolamento)
  fullyParallel: false, // Desabilitado inicialmente para garantir isolamento
  // Impede commits com .only
  forbidOnly: !!process.env.CI,
  // Retry automático em falhas
  retries: process.env.CI ? 2 : 0,
  // Workers paralelos (1 para garantir isolamento)
  workers: 1,
  
  // Reporters
  reporter: process.env.CI || process.env.PLAYWRIGHT_REPORTER === 'simple' ? 'list' : [
    ['html', { open: 'never' }], // Nunca abrir automaticamente
    ['list']
  ],
  
  // Configurações compartilhadas
  use: {
    // URL base será definida dinamicamente pelos containers
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Captura traces em caso de falha
    trace: 'on-first-retry',
    
    // Screenshots apenas em falhas
    screenshot: 'only-on-failure',
    
    // Vídeos apenas em falhas
    video: 'retain-on-failure',
    
    // Opções de navegação
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  // Projetos/Navegadores
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
  ],

  // Iniciar servidor do frontend
  webServer: {
    command: isCI ? 'npm run dev' : 'npm run dev',
    port: 3000,
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});
