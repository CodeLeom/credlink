"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { getRequestStatus } from "../lib/api";

type Props = {
  requestId: string;
  onScored: (wallet: string, txHash?: string) => void;
};

export default function RequestStatus({ requestId, onScored }: Props) {
  const [status, setStatus] = useState<string>("PENDING");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [wallet, setWallet] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const data = await getRequestStatus(requestId);
        if (!active) return;
        setStatus(data.status);
        setTxHash(data.txHash);
        setWallet(data.wallet);
        if (data.status === "SCORED" && data.wallet) {
          onScored(data.wallet, data.txHash);
        }
      } catch (error) {
        if (!active) return;
        setStatus("FAILED");
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [requestId, onScored]);

  return (
    <Card elevation={0} sx={{ border: "1px solid #e9e9e2" }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Request Status</Typography>
          <Typography variant="body2">ID: {requestId}</Typography>
          <Typography variant="body2">Status: {status}</Typography>
          {txHash ? <Typography variant="body2">Tx: {txHash}</Typography> : null}
          {wallet ? <Typography variant="body2">Wallet: {wallet}</Typography> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
