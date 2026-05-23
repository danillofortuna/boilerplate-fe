# ⚛️ Boilerplate React 2026

[![CI](https://github.com/danillofortuna/boilerplate-fe/workflows/CI/badge.svg)](https://github.com/danillofortuna/boilerplate-fe/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Um boilerplate moderno e completo para frontend **Next.js 15+** (App Router), projetado para integrar perfeitamente com o **Boilerplate Spring 2026**.

---

## 📋 Índice

- [✨ Features](#-features)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🚀 Quick Start](#-quick-start)
- [🔌 Integração Backend](#-integração-backend)
- [📁 Estrutura](#-estrutura)
- [🎨 Design System](#-design-system)

---

## ✨ Features

- **⚡ Next.js 15 App Router**: A última word em roteamento e server components.
- **📘 TypeScript**: Tipagem estática rigorosa para DX superior.
- **🎨 CSS Modules**: Estilização flexível e performática (Vanilla CSS).
- **🔒 Integração de Auth**: Preparado para JWT/OAuth2 com o backend Spring.
- **📱 Responsivo**: Layout mobile-first.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Descrição |
|------------|-----------|
| **Next.js** | Framework React de Produção |
| **React** | Biblioteca de UI |
| **TypeScript** | Superset JavaScript |
| **ESLint** | Linter de código |

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- Backend rodando (opcional, mas recomendado)

### 1️⃣ Instalação

```bash
npm install
# ou
yarn
# ou
pnpm install
```

### 2️⃣ Configuração

O arquivo `.env.local` já vem pré-configurado:

```properties
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3️⃣ Rodando

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🔌 Integração Backend

Este frontend foi desenhado para consumir as APIs do `boilerplate-spring-2026`.

### Endpoints Principais

- **Login**: `POST ${NEXT_PUBLIC_API_URL}/v1/auth/login`
- **User Profile**: `GET ${NEXT_PUBLIC_API_URL}/v1/users/me` (com Bearer Token)

---

## 📁 Estrutura

```
src/
├── app/              # App Router Pages & Layouts
│   ├── globals.css   # Estilos globais
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # Componentes Reutilizáveis (Atomic Design)
├── lib/              # Utilitários e configurações
├── hooks/            # Custom Hooks
└── services/         # Camada de API (Fetch/Axios)
```

---

<p align="center">
  Feito com ⚛️ para a comunidade React
</p>
# Test change
