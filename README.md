# 🏛️ Luxé Brechó de Elite — SaaS de Ultra-Luxo

Ecossistema SaaS completo para Brechós Online de luxo, focado em uma experiência de alta costura, exclusividade e performance extrema.

## 📸 Preview do Design

![Homepage do Luxé Brechó](file:///C:/Users/55619/.gemini/antigravity/brain/2706de18-5fb4-4c33-9f78-6f786ed7c7b6/project_home_page_1776740287710.png)

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 15.1 (App Router) + React Server Components |
| **Linguagem** | TypeScript (Strict Mode) |
| **Estilização** | Tailwind CSS **v4** (com `@theme` nativo) |
| **Animações** | Framer Motion (Layout, AnimatePresence, Spring physics) |
| **ORM** | Prisma v6 + MySQL via **Aiven** |
| **Auth** | NextAuth.js v5 (Auth.js) + RBAC |
| **Pagamentos** | Stripe API (Pix, Boleto, Cartão) + Webhooks de Inventário Atômico |
| **Mídia** | Cloudinary (Otimização WebP/AVIF) |

---

## 📂 Estrutura de Pastas Implementada

```
brecho-luxo/
├── prisma/
│   ├── schema.prisma          ✅ Completo (PKs ajustadas para Aiven)
│   └── seed.ts                ✅ Populado com peças de luxo reais
├── src/
│   ├── app/
│   │   ├── (home)             ✅ Hero + Grid de Destaques
│   │   ├── vitrine/           ✅ Catálogo dinâmico (Prisma fetch)
│   │   ├── p/[slug]/          ✅ Detalhes do Produto + Galeria + BuyButton
│   │   ├── categorias/        ✅ Showcase de Departamentos
│   │   ├── api/checkout/      ✅ API de Reserva + Stripe Session
│   │   └── api/webhooks/      ✅ Sincronização de Inventário Atômico
│   ├── components/
│   │   ├── layout/            ✅ Navbar Glassmorphism + Mobile Menu
│   │   ├── product/           ✅ ProductCard 3D + BuyButton interativo
│   │   └── ui/                ✅ Custom Cursor + Ambient Glow
│   ├── lib/
│   │   └── prisma.ts          ✅ Singleton client (v6)
│   └── auth.ts                ✅ Configuração NextAuth v5
└── .env                       ✅ Configurado com Aiven MySQL
```

---

## 💎 Diferenciais do Produto

### 🛡️ Inventário Atômico (Anti-Double-Sell)
O sistema reserva a peça no banco de dados (`RESERVED`) no exato momento em que o checkout é iniciado. O Webhook do Stripe confirma a venda (`SOLD`) ou libera a peça de volta (`AVAILABLE`) em caso de expiração ou falha no pagamento.

### 🎭 Experiência Visual de Elite
- **3D Tilt & Spotlight**: Cards de produtos que reagem ao movimento do mouse com brilho especular.
- **Glassmorphism Puro**: Uso intenso de filtros de desfoque e transparências luxuosas.
- **Custom Cursor**: Cursor inteligente que se adapta e interage com os elementos da tela.
- **Transições Ken Burns**: Efeito de zoom cinematográfico suave no Hero Carousel.

---

## 🛠️ Status do Projeto & Checklist Final

- [x] **Arquitetura Base & Design System** (Tailwind v4)
- [x] **Conexão com Banco Aiven MySQL** (Configurado e Populado)
- [x] **Autenticação NextAuth v5** (Admin: admin@luxe.com / admin123)
- [x] **Vitrine & Página de Detalhes** (Dinâmico via Prisma)
- [x] **Checkout & Sincronização de Inventário** (Stripe Logic)
- [x] **CMS Admin Dashboard** (Inventário & Estatísticas)
- [ ] **Configuração de API Keys (Pendente)**:
    - [ ] Obter `STRIPE_SECRET_KEY` no Dashboard do Stripe.
    - [ ] Configurar Webhook no Stripe para `https://seu-dominio.com/api/webhooks/stripe`.
    - [ ] Criar conta no Cloudinary e obter `CLOUD_NAME`, `API_KEY` e `SECRET`.

---

## ⚙️ Configuração das Variáveis (.env)

Para colocar o site em produção total, você precisa preencher os seguintes campos no seu arquivo `.env`:

### 💳 Stripe
1. Vá em [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).
2. Copie a **Secret key** e cole em `STRIPE_SECRET_KEY`.
3. Copie a **Publishable key** e cole em `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

### ☁️ Cloudinary
1. Vá em [cloudinary.com/console](https://cloudinary.com/console).
2. Copie seu **Cloud Name**, **API Key** e **API Secret**.
3. Preencha os campos correspondentes no `.env`.

---

## 🚀 Como Executar em Produção

1. Suba o código para o GitHub.
2. Conecte na Vercel (ou sua plataforma de preferência).
3. Adicione as variáveis do `.env` nas configurações de Environment Variables da Vercel.
4. Rode `npx prisma generate` no comando de build.


> [!TIP]
> O servidor roda por padrão em `http://localhost:3001`.
