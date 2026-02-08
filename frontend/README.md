# CredLink Frontend

**Pages**
- `/user`: request a credit score, watch status, view score + loan quote
- `/admin`: review and approve/reject requests

**Setup**
```bash
cd frontend
npm i
cp .env.example .env
npm run dev
```

**Env Vars**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SEPOLIA_RPC_URL`
- `NEXT_PUBLIC_CREDIT_BUREAU_ADDRESS`
- `NEXT_PUBLIC_LOAN_MANAGER_ADDRESS`
- `ADMIN_TOKEN` (admin API token)
- `NEXT_PUBLIC_ADMIN_TOKEN` (optional, expose token in browser for admin actions)

**Admin Token**
- The admin page includes a token input field.
- You can also set `NEXT_PUBLIC_ADMIN_TOKEN` for convenience in local demos.
