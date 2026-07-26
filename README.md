# GBI Banking System

A full-stack digital banking application with user authentication, OTP-based verification, and a wallet system for managing balances and transactions.

---

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (stored as httpOnly cookie)
- Brevo (OTP + alert emails)
- bcrypt (password + OTP hashing)
- express-rate-limit (brute-force protection on auth/OTP routes)

**Frontend**
- Plain HTML, CSS, JavaScript
- Central API method
---

## Project Structure

```
Banking-system/
│
├── Backend/
│   └── src/
│       ├── config/
│       │   ├── db.js                   # MongoDB connection
│       │   └── email.js                # Brevo configuration
│       │
│       ├── controllers/
│       │   ├── auth.controller.js      # register, login, logout, verifyOtp, forgetPassword, resetPassword
│       │   ├── wallet.controller.js    # balance, deposit (topup), rate
│       │   └── transaction.controller.js  # sendMoney, getTransactions
│       │
│       ├── middleware/
│       │   ├── auth.middleware.js      # JWT via cookie or Bearer token
│       │   └── limiter.middleware.js   # rate limiting on auth/OTP routes
│       │
│       ├── models/
│       │   ├── user.model.js           # TTL index on otpCreatedAt (10 min)
│       │   ├── wallet.model.js
│       │   └── transaction.model.js
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── wallet.routes.js
│       │   └── transaction.routes.js
│       │
│       ├── services/
│       │   ├── authMail.services.js    # OTP generation + email
│       │   └── email.services.js       # login + transaction alert emails
│       │
│       └── main.js
│
├── Frontend/
│   ├── forgetPass.html
│   ├── index.html
│   ├── ratehere.html
│   ├── register.html
│   ├── verify-otp.html
│   ├── send-money.html
│   ├── login.html
│   ├── dashboard.html
│   └── wallet.html
│   │
│   ├── css/
│   │   ├── index.css
│   │   └── style.css
│   │
│   └── js/
│       ├── api.js          # base fetch wrapper, handles 401 globally
│       ├── auth.js         # register, login, logout, verifyOtp, resendOtp (yet to be added)
│       ├── guard.js        # redirects to /login if not authenticated
│       └── utils.js        # transaction history, escapeHtml, balance helpers
│       │ 
│       │
│       └── pages/      # JS logic of all the pages
│           ├── dashboard.js
│           ├── login.js
│           ├── register.js
│           ├── rate.js
│           ├── forgetPass.js
│           ├── verify-otp.js
│           ├── sendMoney.js
│           └── wallet-page.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Brevo credenitials : api key

### Installation

```bash
# clone the repo
git clone https://github.com/nitishsingh10/Banking-system.git
cd Banking-system

# install dependencies
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```env
PORT= 3000
JWT_SECRET= your_jwt_secret
MONGODB_URI= your_mongodb_uri
CLIENT_ORIGIN= your_frontend_url
EMAIL= your_mail_for_brevo_sender
BREVO_API_KEY= your_BREVO_api_key
```

> to setup brevo credentials : www.brevo.com

### Running the Server

```bash
# development (with nodemon)
npm run dev

# production
npm start
```

Server runs at `http://localhost:3000`

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Rate Limited | Description |
|--------|----------|------|---------------|-------------|
| POST | `/signup` | No | Yes | Register a new user |
| POST | `/otp` | No | Yes (strict) | Verify OTP and activate wallet |
| POST | `/login` | No | Yes | Login and set session cookie |
| POST | `/logout` | Yes | No | Clear session cookie |
| POST | `/forgetPassword` | No | Yes | Request an OTP to reset password |
| POST | `/resetPassword` | No | Yes (strict) | Verify OTP and set a new password |

### Wallet — `/api/wallet`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/balance` | Yes | Get current wallet balance |
| POST | `/topup` | Yes | Add funds to wallet |
| POST | `/ratehere` | Yes | Submit a rating/feedback (identity taken from the JWT, not the request body) |

### Transaction — `/api/transaction`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send` | Yes | Transfer funds to another user (atomic, session-based) |
| GET | `/history` | Yes | Get transaction history, with sender/receiver name + email populated |

### Authentication

The server sets a `httpOnly` cookie on login. All protected routes read the token from either:
- the cookie (browser clients), or
- the `Authorization: Bearer <token>` header (Postman / API clients)

### Rate Limiting

Auth and OTP routes are rate-limited per IP via `express-rate-limit`:
- **General auth limiter** — 10 requests / 15 minutes, applied to `/signup`, `/login`, `/forgetPassword`
- **Strict OTP limiter** — 8 requests / 10 minutes, applied to `/otp`, `/resetPassword` (both consume a 6-digit OTP, so this cap needs to stay low enough that brute-forcing the ~900,000 possible codes isn't realistic)

Requires `app.set('trust proxy', true)` (already set in `main.js`) so the limiter reads the real client IP behind the deployment's reverse proxy, instead of rate-limiting the proxy itself.

---

## User Flow

```
Register → OTP Email → Verify OTP → Login → Dashboard → Wallet
```

1. **Register** — creates an unverified user, sends a 6-digit OTP to email
2. **OTP Verify** — validates OTP (10-minute expiry), creates and links wallet, issues the session cookie
3. **Login** — returns JWT as httpOnly cookie + user data in response body
4. **Dashboard** — shows user info, current balance, and recent transactions (with counterparty name)
5. **Wallet** — view balance, top up funds, and view full transaction history

Unverified users are automatically deleted from the database after 10 minutes via a MongoDB TTL index on `otpCreatedAt`.

---

## Key Design Decisions

**OTP security** — OTPs are hashed with bcrypt before being stored. The plain OTP only ever exists in the email. Comparison uses `bcrypt.compare()`.

**Cookie auth** — JWT is stored in an `httpOnly`, `sameSite: 'lax'` cookie. JS on the frontend cannot read or steal it. `sameSite: 'lax'` (rather than `'strict'`) still blocks the cookie from being sent on cross-site POST requests — which covers the realistic CSRF cases — while still allowing normal top-level navigation (e.g. following a link) to work correctly. `secure: true` is enabled so the cookie is only ever sent over HTTPS.

**Dual auth support** — The auth middleware accepts both the cookie and a Bearer token so the API works from a browser and from Postman/mobile clients without any changes.

**TTL cleanup** — MongoDB automatically deletes unverified user documents after 10 minutes. The `verifyOtp` controller also does a manual age check to handle the ~60-second TTL polling delay. Note: this TTL index sits only on `otpCreatedAt` (the signup-verification field) — password-reset OTPs use a separate, non-indexed `otpAge` field, specifically so that resetting a password can never accidentally trigger deletion of an already-verified account.

**Transaction integrity** — Fund transfers and deposits use MongoDB sessions (`startSession` / `withTransaction`) so a debit and its matching credit either both succeed or both roll back — no partial transfers, even under concurrent requests. `sendMoney` also rejects self-transfers and checks sufficient balance before debiting.

**Rate limiting** — Auth and OTP-consuming routes are capped per IP (see [Rate Limiting](#rate-limiting) above) to make brute-forcing passwords or OTPs impractical.

**Minimal data exposure on transactions** — `getTransactions` populates the counterparty's `name` and `email` only — never phone, address, or password — even though those fields exist on the referenced `User` document.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server runs on (default: 3000) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_ORIGIN` | Frontend URL (used for CORS) |
| `EMAIL` | BREVO sender email |
| `BREVO_API_KEY` | Brevo API Key |

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "feat: your feature"`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request against `dev`

---

## Team

Built by [@nitishsingh10](https://github.com/nitishsingh10) and contributors.