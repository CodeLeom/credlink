"use client";

import { useMemo } from "react";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
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
    const timestamp = Number(updatedAt) * 1000;
    return {
      score: Number(score),
      tier: Number(tier),
      updatedAt: timestamp ? new Date(timestamp).toLocaleString() : "N/A",
    };
  }, [data]);

  if (!wallet) {
    return (
      <Card elevation={0} sx={{ border: "1px solid #ecece6" }}>
        <CardContent>
          <Typography variant="body2">Connect a wallet to view on-chain score.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: "1px solid #e0e0da" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6">On-chain Score</Typography>
          {parsed ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h3">{parsed.score}</Typography>
                <Chip label={tierLabel(parsed.tier)} color="primary" variant="outlined" />
              </Stack>
              <Typography variant="body2">Last updated: {parsed.updatedAt}</Typography>
            </>
          ) : (
            <Typography variant="body2">Loading on-chain score...</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
