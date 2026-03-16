# AI Life OS — Personal Decision Engine

> **AI-powered decision simulation engine.** Predict life impact, analyze risks, and simulate scenarios for your biggest life decisions — powered by GPT-4o, Next.js, Firebase, and Framer Motion.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)](https://firebase.google.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green?logo=openai)](https://openai.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

---

## Features

| Feature | Description |
|---|---|
| **Life Impact Prediction** | AI scores financial, career, personal, social, and health dimensions (0–100) |
| **Risk Analysis** | Identifies risk factors with level ratings and mitigation strategies |
| **Scenario Simulation** | Best case, most likely, and worst case with probability weights |
| **Key Insights & Actions** | Distilled insights and a concrete action plan |
| **Decision History** | Saved to Firestore, viewable and deletable anytime |
| **Authentication** | Google OAuth + Email/Password via Firebase Auth + NextAuth v5 |
| **Animated UI** | Framer Motion transitions, responsive dark-first design |

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, React Server Components)
- **Tailwind CSS v4** (CSS-based configuration)
- **Framer Motion** (animations)
- **shadcn/ui** (Radix UI primitives + cva)
- **Recharts** (radar chart for life impact)
- **Lucide React** (icons)

### Backend
- **Next.js API Routes** (Edge-compatible)
- **Firebase Firestore** (decision history storage)
- **Firebase Auth** (user management via REST API)

### AI
- **OpenAI GPT-4o** (structured JSON decision analysis)

### Auth
- **NextAuth v5 (Auth.js)** — Google OAuth + Credentials provider

### Testing
- **Jest** + **@testing-library/react** + **@testing-library/user-event**

---

## Project Structure

```
decision-intelligence-system/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard shell with Navbar
│   │   ├── dashboard/page.tsx      # Main decision engine page
│   │   └── history/page.tsx        # Decision history page
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth handler
│   │   ├── auth/register/          # Firebase user registration
│   │   ├── analyze/                # OpenAI analysis endpoint
│   │   └── decisions/              # CRUD for decision history
│   ├── layout.tsx                  # Root layout (SessionProvider, Toaster)
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Tailwind v4 CSS variables + dark theme
├── auth.ts                         # NextAuth v5 configuration
├── middleware.ts                   # Route protection
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── auth/AuthForm.tsx           # Login/Register form
│   ├── dashboard/
│   │   ├── DecisionForm.tsx        # Decision input form
│   │   ├── ResultsPanel.tsx        # AI results display
│   │   ├── ScenarioCard.tsx        # Individual scenario card
│   │   ├── RiskChart.tsx           # Recharts radar chart
│   │   └── HistoryList.tsx         # Decision history list
│   └── layout/
│       ├── Navbar.tsx              # Sticky top navigation
│       └── Footer.tsx              # Site footer
├── hooks/
│   ├── useDecision.ts              # Decision analysis state/logic
│   └── useAuth.ts                  # Auth helpers
├── lib/
│   ├── firebase.ts                 # Firebase app init
│   ├── firestore.ts                # Firestore CRUD helpers
│   ├── openai.ts                   # OpenAI analysis + prompt builder
│   └── utils.ts                    # cn(), formatters, color helpers
├── types/
│   ├── index.ts                    # All TypeScript types
│   └── next-auth.d.ts              # NextAuth session type extension
├── __tests__/
│   ├── lib/utils.test.ts           # Utility function tests
│   ├── components/
│   │   ├── Navbar.test.tsx
│   │   ├── DecisionForm.test.tsx
│   │   └── ResultsPanel.test.tsx
│   └── api/analyze.test.ts         # API route tests
├── jest.config.ts
├── jest.setup.ts
└── env.example                     # Environment variable template
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd decision-intelligence-system
npm install
```

### 2. Set Up Environment Variables

Copy `env.example` to `.env.local` and fill in the values:

```bash
cp env.example .env.local
```

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI (platform.openai.com)
OPENAI_API_KEY=sk-your-openai-api-key

# Firebase (console.firebase.google.com)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create a project
2. Enable **Authentication** → Sign-in Methods → **Email/Password**
3. Enable **Firestore Database** → Start in production mode
4. Add the Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /decisions/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

5. **Set up Firebase Admin SDK** (required for server-side Firestore access):
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
   - Add to `.env.local`:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
   - See [FIREBASE_ADMIN_SETUP.md](./FIREBASE_ADMIN_SETUP.md) for detailed instructions

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000/api/auth/callback/google` as an Authorized redirect URI

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run all Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint with ESLint |

---

## API Reference

### `POST /api/analyze`

Analyze a decision with GPT-4o.

**Body:**
```json
{
  "inputs": {
    "decisionType": "job-switch",
    "title": "Should I accept the Stripe offer?",
    "context": "I have 5 years of experience...",
    "currentSalary": 80000,
    "proposedSalary": 120000
  },
  "saveToHistory": true
}
```

**Response:**
```json
{
  "results": {
    "summary": "...",
    "recommendation": "...",
    "recommendationStrength": "strongly-recommended",
    "lifeImpact": { "financial": 88, "career": 92, "overall": 85, ... },
    "riskLevel": "medium",
    "riskFactors": [...],
    "scenarios": [...],
    "keyInsights": [...],
    "actionItems": [...],
    "confidenceScore": 87
  },
  "decisionId": "abc123"
}
```

### `GET /api/decisions`
Returns all decisions for the authenticated user. Requires auth.

### `DELETE /api/decisions/:id`
Deletes a decision by ID. Requires auth and ownership.

---

## Decision Types

| Type | Extra Fields |
|---|---|
| `job-switch` | `currentSalary`, `proposedSalary` |
| `relocation` | `currentLocation`, `targetLocation` |
| `custom` | None — describe everything in context |

---

## Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- __tests__/lib/utils.test.ts

# Coverage report
npm run test:coverage
```

Test coverage includes:
- **Utility functions** — formatting, color helpers, text manipulation
- **Component rendering** — Navbar, DecisionForm, ResultsPanel
- **API routes** — analyze endpoint (mocked OpenAI + Firestore)

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set all environment variables in the Vercel dashboard under Project Settings → Environment Variables.

### Environment Variables for Production

Ensure all variables from `env.example` are set, with:
- `NEXTAUTH_URL` pointing to your production domain
- Firebase authorized domains updated in Firebase Console
- Google OAuth redirect URIs updated in Google Cloud Console

---

## Architecture Decisions

- **NextAuth v5 + Firebase Auth REST API** — Credentials provider calls Firebase Auth REST API to validate credentials server-side without requiring Firebase Admin SDK
- **Firestore for data** — Decision history stored per `userId`, with security rules enforcing ownership
- **GPT-4o with JSON mode** — Structured `response_format: json_object` ensures consistent, parseable AI responses
- **Tailwind v4 CSS variables** — Design tokens defined in `:root` and mapped via `@theme inline` for full dark theme support
- **Route groups** — `(auth)` and `(dashboard)` organize pages without affecting URLs

---
