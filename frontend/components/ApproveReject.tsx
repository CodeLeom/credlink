"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { approveRequest, rejectRequest } from "../lib/api";
import { useNotification } from "./NotificationProvider";

type Props = {
  id: string;
  token: string;
  onAction: () => void;
};

export default function ApproveReject({ id, token, onAction }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { notify } = useNotification();

  const handle = async (action: "approve" | "reject") => {
    setLoading(true);
    setError("");
    try {
      if (action === "approve") {
        await approveRequest(id, token);
        notify({ message: "Request approved", severity: "success" });
      } else {
        await rejectRequest(id, token);
        notify({ message: "Request rejected", severity: "info" });
      }
      onAction();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setError(msg);
      notify({ message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={1}
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
    >
      <Button
        variant="contained"
        onClick={() => handle("approve")}
        disabled={loading}
      >
        Approve
      </Button>
      <Button
        variant="outlined"
        onClick={() => handle("reject")}
        disabled={loading}
      >
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
