# CredLink: On-Chain Credit Bureau

CredLink is an on-chain credit bureau that stores a canonical score per wallet. A Chainlink CRE workflow computes a score off-chain, reaches consensus, and writes the score on-chain for DeFi consumers.

**Architecture**
```
HTTP Trigger -> Fetch Scoring API -> Compute Hashes -> Consensus -> Chainwrite setScore()
```

**Components**
- `contracts/`: `CreditBureau` registry + `LoanManager` consumer policy
- `scoring-api/`: deterministic scoring API (mockable)
- `workflow/`: CRE workflow that hashes signals and writes to Sepolia

**Where Chainlink/CRE is used**
- The CRE workflow fetches the scoring API, performs hash computation, reaches consensus, and performs the chainwrite to `CreditBureau.setScore(...)`.

**Product Flow (User → Admin → Chainlink CRE)**
```
User UI
  ↓
app-api (request + email)
  ↓
Admin UI (approve)
  ↓
CRE Workflow (HTTP trigger)
  ↓
Consensus → Chainwrite
  ↓
CreditBureau
  ↓
User UI (score + loan quote)
```
