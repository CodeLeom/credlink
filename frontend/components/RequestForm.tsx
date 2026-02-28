"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "@wagmi/connectors";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { createRequest } from "../lib/api";
import { useNotification } from "./NotificationProvider";

type Props = {
  onCreated: (id: string) => void;
};

export default function RequestForm({ onCreated }: Props) {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);
  const { notify } = useNotification();

  const handleSubmit = async () => {
    setError("");
    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createRequest({ userEmail: email, wallet: address });
      onCreated(result.id);
      setCreatedId(result.id);
      notify({
        message: `Request created (${result.id})`,
        severity: "success",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit.";
      setError(msg);
      notify({ message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e2dd" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Request Credit Score</Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            {isConnected ? (
              <>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  Wallet: {address}
                </Typography>
                <Button variant="outlined" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => connect({ connector: injected() })}
                disabled={isPending}
              >
                Connect Wallet
              </Button>
            )}
          </Stack>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Request Score"}
          </Button>
          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : null}
          {createdId ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">ID: {createdId}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(createdId);
                  notify({ message: "Copied ID to clipboard" });
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
