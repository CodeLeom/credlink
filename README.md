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

**End-to-End Demo**
```bash
# 1) Contracts
cd contracts
forge test
cp .env.example .env
source .env
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY

# 2) Set updater
export CREDIT_BUREAU_ADDRESS=0x...
export UPDATER_ADDRESS=0x...
forge script script/SetUpdater.s.sol:SetUpdater --rpc-url $SEPOLIA_RPC_URL --broadcast --private-key $PRIVATE_KEY

# 3) Scoring API
cd ../scoring-api
npm i
cp .env.example .env
npm run dev

# 4) Workflow
cd ../workflow
npm i
cp .env.example .env
npm run simulate -- --user 0xYourWallet
npm run broadcast -- --user 0xYourWallet

# 5) Verify on-chain
cast call $CREDIT_BUREAU_ADDRESS \
  "getScore(address)(uint16,uint8,uint40,bytes32,bytes32)" 0xYourWallet \
  --rpc-url $SEPOLIA_RPC_URL

# 6) Loan quote
cast call $LOAN_MANAGER_ADDRESS \
  "quoteLoan(address,uint256,uint256)(bool,uint256,string)" 0xYourWallet 1000 2000 \
  --rpc-url $SEPOLIA_RPC_URL
```

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
