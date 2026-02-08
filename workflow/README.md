# CredLink CRE Workflow

**Purpose**
- Fetch a user score from the scoring API
- Hash signals + model version
- (Broadcast) call `CreditBureau.setScore(...)` on Sepolia

**Setup**
```bash
npm i
cp .env.example .env
```

**Simulate (no tx)**
```bash
npm run simulate -- --user 0xYourWallet
```

**Broadcast (send tx)**
```bash
npm run broadcast -- --user 0xYourWallet
```

**Expected Output (broadcast)**
```json
{
  "user": "0x...",
  "score": 742,
  "modelVersion": "v1.0.0",
  "modelVersionBytes32": "0x...",
  "signalsHash": "0x...",
  "txHash": "0x..."
}
```

**Env Vars**
- `SEPOLIA_RPC_URL`
- `WORKFLOW_SIGNER_PRIVATE_KEY`
- `CREDIT_BUREAU_ADDRESS`
- `SCORING_API_URL`
