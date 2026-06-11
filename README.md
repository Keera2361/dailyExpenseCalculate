# Daily Expenses Tracker

A small, full‑stack app to record and visualise daily expenses. The backend is an Express API with MongoDB, and the frontend is a lightweight static UI in the `Frontend/` folder.

## Quick Features
- Add expenses with optional custom date
- Per-user data isolation (JWT + server-side session tracking)
- Delete single or all expenses
- Monthly spending chart (Chart.js)

## Tech stack
- Node.js + Express
- MongoDB (Mongoose)
- Vanilla HTML/CSS/JS (+ Chart.js)

## Requirements
- Node 18+ (or a recent LTS)
- MongoDB available (local or remote)

## Environment
Create a `.env` file in the project root with at least:

- `MONGO_URI` — MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/daily-expense-calculate`)
- `JWT_SECRET` — a long random secret for signing tokens
- `PORT` — optional (default 8000)

## Setup
1. Clone the repository

```bash
git clone https://github.com/Keera2361/dailyExpenseCalculate.git
cd dailyExpenseCalculate
```
2. Install dependencies

```bash
npm install
```
3. Create `.env` and add required variables (see Environment above).

4. Start the app

```bash
node server.js
# or for development (auto-restart):
npm run dev
```

Open `Frontend/index.html` in a browser (or serve the folder) and log in/register.

## API (short)
- `POST /api/user/register` — register (returns `token`)
- `POST /api/user/login` — login (returns `token`)
- `POST /api/user/logout` — logout (revokes session)
- `POST /api/expenses/add` — add expense (protected)
- `GET /api/expenses` — list user expenses (protected)
- `DELETE /api/expenses/delete/:id` — delete one expense (protected)
- `DELETE /api/expenses/delete/all` — delete all user expenses (protected)

Protected endpoints require `Authorization: Bearer <token>` header. The app issues short-lived access tokens and stores server-side session records to support revocation.

## Frontend behaviour
- Optional "Use custom date" checkbox allows entering a manual date. If unchecked, today's date is used automatically.
- Each expense shows its date in the list and contributes to the monthly chart.

## Development & tests
- Quick API tests included under `scripts/`: `scripts/test_api.js` and `scripts/test_two_users.js` illustrate register/login/add/get flows and session revocation checks.

## Security notes (recommended)
- Rotate `JWT_SECRET` if you suspect compromise and revoke sessions.
- Run behind HTTPS (TLS) in production and set proper CORS rules.
- Consider storing tokens in HttpOnly Secure cookies and implementing refresh-token rotation.
- Add HaveIBeenPwned password checks and optional 2FA for better protection.

## Roadmap
- Add HIBP password checks on register/change
- Implement refresh token flow with HttpOnly cookies
- Sessions UI (list/revoke device sessions)
- Unit & E2E tests, CI, Docker + deployment guides

## Contributing
PRs welcome. Please open issues for feature requests or bug reports.

## License
MIT
