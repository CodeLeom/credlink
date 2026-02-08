# CredLink App API

**Purpose**
- Store credit score requests
- Send emails via Resend
- Trigger the CRE workflow HTTP endpoint

**Setup**
```bash
cd app-api
npm i
cp .env.example .env
npm run dev
```

**Endpoints**
- `POST /requests`
- `GET /requests/:id`
- `GET /admin/requests?status=PENDING`
- `POST /admin/requests/:id/approve`
- `POST /admin/requests/:id/reject`

**Admin Auth**
- Header: `Authorization: Bearer <ADMIN_TOKEN>`

**Example**
```bash
curl -X POST http://localhost:4000/requests \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"user@example.com","wallet":"0x1111111111111111111111111111111111111111"}'

curl http://localhost:4000/admin/requests?status=PENDING \
  -H "Authorization: Bearer changeme"
```
