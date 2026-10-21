# Shoption Full-Stack Authentication & Dashboard Suite

A modern, production-grade full-stack web application featuring a **Next.js 15 (App Router)** frontend, a **FastAPI (ASGI)** backend, local **MongoDB** persistence, and secure **JWT Access Token** authentication.

---

## 🚀 Architecture Overview

```
Shoption task/
├── backend/                  # FastAPI Backend API
│   ├── app/
│   │   ├── auth/             # JWT creation/verification & bcrypt security
│   │   ├── models/           # Pydantic schemas (User, Token, Dashboard)
│   │   ├── routers/          # API route handlers (/api/auth & /api/dashboard)
│   │   ├── config.py         # App configuration & settings
│   │   ├── database.py       # Motor async MongoDB connection & indexing
│   │   └── main.py           # FastAPI entry point & CORS configuration
│   ├── venv/                 # Python 3.12 virtual environment
│   └── requirements.txt      # Backend Python dependencies
│
└── frontend/                 # Next.js 15 Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # Root layout with AuthProvider & Navbar
    │   │   ├── page.tsx      # Home page (Profile Showcase & Analytics Dashboard)
    │   │   ├── login/        # JWT Login page
    │   │   ├── register/     # User Registration page (captures full profile)
    │   │   └── globals.css   # Dark mode design tokens & glassmorphism
    │   ├── components/       # Reusable UI components (Navbar, Cards, Badges)
    │   ├── context/          # React AuthContext with auto-refresh & localStorage
    │   └── types/            # TypeScript interfaces
    └── next.config.ts        # Next.js proxy rewrite configuration
```

---

## ⚡ Features

1. **Login Page (`/`)**:
   - The default root route now immediately renders the Login screen.
   - Accepts either username or email + password.
   - Verifies hashed password with `bcrypt`.
   - Generates HS256 signed JWT Access Token with expiration.
   - On successful login, automatically redirects to `/home`.
   - If already logged in, instantly redirects to `/home`.

2. **Home Page (`/home`)**:
   - Displays all user registration details prominently in an obsidian-glass profile card:
     - Full Name, Username, Member since, MongoDB Doc ID
     - Professional Role, Company, Location, Phone, Email
     - Biography & Summary
     - Registered technical skills tags
   - Displays dynamic random platform analytics fetched from FastAPI:
     - 4 KPI cards (Total API Requests, Active Deployments, Database Health, Security Posture)
     - 24-hour hourly traffic bar telemetry
     - Live event auditing logs
     - Active task workspaces with progress tracking
   - Real-time **Sync Data** and **Sign Out** actions (signs out and returns to `/`).
   - If accessed while unauthenticated, automatically redirects to `/`.

3. **User Registration (`/register`)**:
   - Collects comprehensive user info:
     - Full Name, Username & Email
     - Password (securely hashed with `bcrypt`)
     - Professional Role / Title & Company / Organization
     - Location & Phone Number
     - Bio / About Summary
     - Technical Skills (interactive tags)
   - Features a ⚡ **Autofill Sample Details** button for 1-click testing.
   - On success, stores document in local MongoDB, saves JWT token, and redirects to `/home`.

---

## 🛠️ How to Run Locally

### Prerequisites
- Python 3.10+ (tested with Python 3.12)
- Node.js 18+ & npm (tested with Node v22)
- Local MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Start the FastAPI Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs (Swagger UI): `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### 2. Start the Next.js Frontend
```powershell
cd frontend
npm run dev
```
- Frontend Web App: `http://localhost:3000`

---

## 🛡️ Security Details
- **Password Storage**: Passwords are never stored in plain text; they are salted and hashed using `bcrypt` (12 rounds).
- **Access Control**: Protected FastAPI routes require `Authorization: Bearer <access_token>`.
- **Validation**: Strict input schema validation via Pydantic v2 with custom error handling.
