# Testes End-to-End com Playwright

## 🚀 Setup Inicial

### 1. Instalar dependências
```bash
npm install
```

### 2. Instalar navegadores do Playwright
```bash
npx playwright install chromium
```

## 🎯 Executando os Testes

### Pré-requisitos

1. **Backend rodando**: O backend precisa estar rodando em `http://localhost:8080`
2. **Frontend rodando**: O frontend precisa estar rodando em `http://localhost:3000`

### Comandos disponíveis

```bash
# Rodar todos os testes (headless)
npm run test:e2e

# Rodar com interface visual do Playwright
npm run test:e2e:ui

# Rodar em modo debug (passo a passo)
npm run test:e2e:debug

# Rodar com navegador visível
npm run test:e2e:headed

# Ver relatório após execução
npm run test:e2e:report
```

### Executando um teste específico

```bash
# Apenas testes de login
npx playwright test login.spec.ts

# Apenas um teste específico
npx playwright test -g "deve fazer login com sucesso"
```

## 📸 Screenshots

Screenshots são salvos automaticamente em `tests/screenshots/` quando:
- Um teste falha (automático)
- Explicitamente no código do teste (para debug)

## 🐛 Debugging

### Ver o que está acontecendo
```bash
# Executa com o navegador visível e devtools aberto
npm run test:e2e:debug
```

### Trace Viewer
Após falhas, traces são salvos. Para visualizar:
```bash
npx playwright show-trace trace.zip
```

## 📁 Estrutura dos Testes

```
tests/
├── e2e/
│   └── auth/
│       └── login.spec.ts      # Testes de autenticação
├── helpers/
│   └── test-utils.ts          # Utilitários para testes
├── screenshots/               # Screenshots capturadas
└── README.md                 # Esta documentação
```

## ✅ Checklist para rodar os testes

1. [ ] Backend está rodando em `http://localhost:8080`
2. [ ] Frontend está rodando em `http://localhost:3000`
3. [ ] Credenciais do admin configuradas (padrão: admin@boilerplate.com / admin123)
4. [ ] Playwright está instalado (`npx playwright install chromium`)
5. [ ] Executar: `npm run test:e2e`

## 🔴 Troubleshooting

### "Login failed" 
- Verifique se a senha do admin está correta (`admin123` é o padrão)
- Confirme que o backend está rodando
- Verifique os logs do backend

### "Page not found"
- Confirme que o frontend está rodando em `http://localhost:3000`
- Verifique se não há erros de build no frontend

### Timeout errors
- Aumente os timeouts no `playwright.config.ts`
- Verifique a performance da máquina
- Considere rodar com `--headed` para ver o que está acontecendo

## 🎨 Adicionando Novos Testes

Para adicionar um novo teste, crie um arquivo `.spec.ts` na pasta apropriada:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Meu novo teste', () => {
  test('deve fazer algo', async ({ page }) => {
    await page.goto('/');
    // ... seu teste aqui
  });
});
```

## 📊 Relatórios

Após rodar os testes, você pode visualizar um relatório HTML:

```bash
npm run test:e2e:report
```

Isso abrirá um relatório interativo mostrando:
- Testes que passaram/falharam
- Screenshots de falhas
- Traces de execução
- Tempo de execução
