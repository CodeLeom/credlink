"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { createRequest } from "../lib/api";

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e2dd" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Request Credit Score</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
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
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Request Score"}
          </Button>
          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
