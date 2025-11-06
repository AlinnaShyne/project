# 🔒 Privacy - Sistema de Pagamento PIX com Next.js

Sistema completo de pagamento PIX integrado com PushinPay para conteúdo premium, desenvolvido com Next.js para máxima segurança.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com SSR
- **React 18** - Biblioteca UI
- **PushinPay API** - Pagamentos PIX
- **Vercel** - Hospedagem e Deploy

## 📋 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/AlinnaShyne/project.git
cd project
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e preencha com suas credenciais:

```env
# PushinPay Configuration
PUSHINPAY_TOKEN=seu_token_pushinpay_aqui

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=seu_bot_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

# WhatsApp (opcional)
WHATSAPP_NUMBER=seu_numero_whatsapp_aqui

# Valores dos Planos (em centavos)
PLANO_VITALICIO_19_90=1990
PLANO_3_MESES=5000
PLANO_VITALICIO_100_00=10000

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Nunca faça commit do arquivo `.env.local`! Ele já está protegido no `.gitignore`.

### 4. Execute localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta no GitHub
- Conta na Vercel (gratuita)
- Repositório no GitHub configurado

### Deploy Rápido

1. **Faça push do código para o GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/AlinnaShyne/project.git
   git push -u origin main
   ```

2. **Conecte ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Conecte sua conta do GitHub se ainda não estiver conectada
   - Selecione o repositório **AlinnaShyne/project**

3. **Configure o Projeto:**
   - Framework Preset: **Next.js** (detectado automaticamente)
   - Root Directory: `./` (raiz)
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `.next` (já configurado)

4. **Configure Environment Variables:**
   - Clique em "Environment Variables"
   - Adicione todas as variáveis do seu `.env.local`:
     - `PUSHINPAY_TOKEN`
     - `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
     - `TELEGRAM_BOT_TOKEN` (opcional)
     - `TELEGRAM_CHAT_ID` (opcional)
     - `WHATSAPP_NUMBER` (opcional)
     - `PLANO_VITALICIO_19_90`
     - `PLANO_3_MESES`
     - `PLANO_VITALICIO_100_00`
     - `NEXT_PUBLIC_BASE_URL` (será atualizado automaticamente após o deploy)
     - `NEXT_PUBLIC_SITE_URL` (será atualizado automaticamente após o deploy)

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (~2-3 minutos)
   - Após o deploy, atualize `NEXT_PUBLIC_BASE_URL` e `NEXT_PUBLIC_SITE_URL` com a URL do Vercel

### URLs
- **Repositório**: https://github.com/AlinnaShyne/project
- **Deploy**: Será gerado automaticamente pela Vercel (ex: `project-xyz.vercel.app`)

## 🔐 Segurança

- ✅ Tokens protegidos no servidor via API Routes
- ✅ Nenhum token exposto no cliente (HTML/JS)
- ✅ Variáveis de ambiente para todas as credenciais
- ✅ `.env.local` protegido no `.gitignore`

## 📁 Estrutura do Projeto

```
/
├── .env.local              # Variáveis de ambiente (não vai para git)
├── .gitignore              # Protege arquivos sensíveis
├── next.config.js          # Configuração Next.js
├── package.json            # Dependências
├── pages/
│   ├── _app.js            # Configuração Next.js
│   ├── index.js           # Página principal (React)
│   ├── agradecimento.js   # Pós-pagamento (React)
│   └── api/
│       ├── pushinpay.js   # API protegida PushinPay
│       └── telegram.js    # API protegida Telegram
├── components/
│   ├── MediaGrid.js       # Grid de mídias
│   └── ModalPagamento.js  # Modal de pagamento PIX
├── public/
│   ├── images/            # Imagens e vídeos
│   ├── css/               # Estilos
│   └── js/                # JavaScript cliente
└── README.md              # Este arquivo
```

## 🎨 Funcionalidades

- ✅ Sistema de pagamento PIX completo
- ✅ QR Code gerado automaticamente
- ✅ Verificação de pagamento em tempo real
- ✅ Notificações via Telegram
- ✅ Rastreamento Facebook Pixel
- ✅ Interface responsiva (mobile + desktop)
- ✅ Segurança máxima (tokens no servidor)
- ✅ React components reutilizáveis
- ✅ Código HTML migrado para Next.js
- ✅ Arquivos HTML originais protegidos no GitHub

## 📝 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ para facilitar pagamentos PIX seguros**
