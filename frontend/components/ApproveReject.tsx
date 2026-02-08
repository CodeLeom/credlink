"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { approveRequest, rejectRequest } from "../lib/api";

type Props = {
  id: string;
  token: string;
  onAction: () => void;
};

export default function ApproveReject({ id, token, onAction }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (action: "approve" | "reject") => {
    setLoading(true);
    setError("");
    try {
      if (action === "approve") {
        await approveRequest(id, token);
      } else {
        await rejectRequest(id, token);
      }
      onAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1} direction={{ xs: "column", sm: "row" }} alignItems="center">
      <Button variant="contained" onClick={() => handle("approve")} disabled={loading}>
        Approve
      </Button>
      <Button variant="outlined" onClick={() => handle("reject")} disabled={loading}>
        Reject
      </Button>
      {error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
