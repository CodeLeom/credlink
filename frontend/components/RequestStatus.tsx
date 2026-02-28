"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getRequestStatus } from "../lib/api";
import { useNotification } from "./NotificationProvider";

type Props = {
  requestId: string;
  onScored: (wallet: string, txHash?: string) => void;
};

export default function RequestStatus({ requestId, onScored }: Props) {
  const [status, setStatus] = useState<string>("PENDING");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [wallet, setWallet] = useState<string | undefined>(undefined);
  const { notify } = useNotification();

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
          notify({ message: "Score available!", severity: "success" });
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
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">ID: {requestId}</Typography>
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(requestId);
                notify({ message: "Copied request ID" });
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Status:</Typography>
            <Chip
              label={status}
              color={
                status === "PENDING"
                  ? "warning"
                  : status === "SCORED"
                    ? "success"
                    : status === "FAILED"
                      ? "error"
                      : "default"
              }
              size="small"
            />
          </Stack>
          {txHash ? (
            <Typography variant="body2">Tx: {txHash}</Typography>
          ) : null}
          {wallet ? (
            <Typography variant="body2">Wallet: {wallet}</Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
