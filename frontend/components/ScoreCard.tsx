"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { creditBureauAbi, creditBureauAddress } from "../lib/contracts";

type Props = {
  wallet?: string;
};

const tierLabel = (tier: number) => {
  if (tier === 1) return "Subprime";
  if (tier === 2) return "Near-prime";
  if (tier === 3) return "Prime";
  if (tier === 4) return "Super-prime";
  return "Unknown";
};

export default function ScoreCard({ wallet }: Props) {
  const enabled = Boolean(wallet && creditBureauAddress);
  const { data } = useReadContract({
    abi: creditBureauAbi,
    address: creditBureauAddress,
    functionName: "getScore",
    args: wallet ? [wallet as `0x${string}`] : undefined,
    query: { enabled },
  });

  const parsed = useMemo(() => {
    if (!data) return undefined;
    const [score, tier, updatedAt] = data as unknown as [number, number, number];
    return { score: Number(score), tier: Number(tier), updatedAt: Number(updatedAt) };
  }, [data]);

  if (!wallet) {
    return <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>No wallet</div>;
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
      <h3>On-chain Score</h3>
      {parsed ? (
        <div>
          <p>Score: {parsed.score}</p>
          <p>Tier: {tierLabel(parsed.tier)}</p>
          <p>Updated: {parsed.updatedAt}</p>
        </div>
      ) : (
        <p>Loading on-chain score...</p>
      )}
    </div>
  );
}
