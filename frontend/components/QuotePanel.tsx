"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { loanManagerAbi, loanManagerAddress } from "../lib/contracts";

type Props = {
  wallet?: string;
};

export default function QuotePanel({ wallet }: Props) {
  const [amountUsd, setAmountUsd] = useState(1000);
  const [collateralUsd, setCollateralUsd] = useState(2000);

  const enabled = Boolean(wallet && loanManagerAddress);
  const { data } = useReadContract({
    abi: loanManagerAbi,
    address: loanManagerAddress,
    functionName: "quoteLoan",
    args: wallet ? [wallet as `0x${string}`, BigInt(amountUsd), BigInt(collateralUsd)] : undefined,
    query: { enabled },
  });

  const parsed = data as unknown as [boolean, bigint, string] | undefined;

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
      <h3>Loan Quote</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="number"
          value={amountUsd}
          onChange={(event) => setAmountUsd(Number(event.target.value))}
          placeholder="Amount USD"
        />
        <input
          type="number"
          value={collateralUsd}
          onChange={(event) => setCollateralUsd(Number(event.target.value))}
          placeholder="Collateral USD"
        />
      </div>
      {parsed ? (
        <div style={{ marginTop: 12 }}>
          <p>Approved: {parsed[0] ? "Yes" : "No"}</p>
          <p>APR (bps): {parsed[1].toString()}</p>
          <p>Reason: {parsed[2]}</p>
        </div>
      ) : (
        <p style={{ marginTop: 12 }}>Waiting for data...</p>
      )}
    </div>
  );
}
