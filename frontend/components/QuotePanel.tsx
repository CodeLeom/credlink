"use client";

import { useState } from "react";
import { Card, CardContent, Stack, TextField, Typography, Chip } from "@mui/material";
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
    <Card elevation={0} sx={{ border: "1px solid #e0e0da" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Loan Quote</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Amount USD"
              type="number"
              value={amountUsd}
              onChange={(event) => setAmountUsd(Number(event.target.value))}
              fullWidth
            />
            <TextField
              label="Collateral USD"
              type="number"
              value={collateralUsd}
              onChange={(event) => setCollateralUsd(Number(event.target.value))}
              fullWidth
            />
          </Stack>
          {parsed ? (
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1">
                  Approved: {parsed[0] ? "Yes" : "No"}
                </Typography>
                <Chip
                  label={parsed[2]}
                  color={parsed[0] ? "primary" : "default"}
                  variant="outlined"
                  size="small"
                />
              </Stack>
              <Typography variant="body2">APR (bps): {parsed[1].toString()}</Typography>
            </Stack>
          ) : (
            <Typography variant="body2">Waiting for data...</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
