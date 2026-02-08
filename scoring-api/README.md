# CredLink Scoring API

**Endpoints**
- `GET /health` -> `{ ok: true }`
- `GET /score?user=0x...` -> score payload

**Example**
```bash
curl "http://localhost:3001/health"
curl "http://localhost:3001/score?user=0x1111111111111111111111111111111111111111"
```

**Mock Mode**
- Set `SCORING_MODE=mock` to enable deterministic demo outputs.
- Known addresses return fixed scores (820 / 720 / 560).
- Unknown addresses use the deterministic rubric with seeded signals.

**Rubric (Deterministic)**
- base = 600
- + min(walletAgeDays / 10, 80)
- + min(txCount30d * 2, 60)
- + min(log10(avgBalanceUsd + 1) * 40, 80)
- + repaymentOnchain * 60
- clamp to [300, 900]
- round down to integer

**Run**
```bash
npm i
cp .env.example .env
npm run dev
```
