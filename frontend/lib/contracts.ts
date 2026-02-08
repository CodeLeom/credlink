export const creditBureauAbi = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getScore",
    outputs: [
      { internalType: "uint16", name: "score", type: "uint16" },
      { internalType: "uint8", name: "tier", type: "uint8" },
      { internalType: "uint40", name: "updatedAt", type: "uint40" },
      { internalType: "bytes32", name: "modelVersion", type: "bytes32" },
      { internalType: "bytes32", name: "signalsHash", type: "bytes32" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const loanManagerAbi = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amountUsd", type: "uint256" },
      { internalType: "uint256", name: "collateralUsd", type: "uint256" }
    ],
    name: "quoteLoan",
    outputs: [
      { internalType: "bool", name: "approved", type: "bool" },
      { internalType: "uint256", name: "aprBps", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const creditBureauAddress = process.env.NEXT_PUBLIC_CREDIT_BUREAU_ADDRESS as `0x${string}` | undefined;
export const loanManagerAddress = process.env.NEXT_PUBLIC_LOAN_MANAGER_ADDRESS as `0x${string}` | undefined;
