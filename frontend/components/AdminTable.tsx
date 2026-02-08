"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { listAdminRequests } from "../lib/api";
import ApproveReject from "./ApproveReject";

type RequestRow = {
  id: string;
  userEmail: string;
  wallet: string;
  status: string;
  createdAt: number;
  updatedAt: number;
};

export default function AdminTable() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState(
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || process.env.ADMIN_TOKEN || ""
  );

  const load = async () => {
    try {
      const result = await listAdminRequests("PENDING", token);
      setRequests(result.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e2dd" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Pending Requests</Typography>
          <TextField
            type="password"
            label="Admin token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            fullWidth
          />
          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : null}
          {requests.length === 0 ? (
            <Typography variant="body2">No pending requests.</Typography>
          ) : null}
          {requests.map((req, index) => (
            <Stack key={req.id} spacing={1}>
              {index > 0 ? <Divider /> : null}
              <Typography variant="subtitle2">ID: {req.id}</Typography>
              <Typography variant="body2">Email: {req.userEmail}</Typography>
              <Typography variant="body2">Wallet: {req.wallet}</Typography>
              <ApproveReject id={req.id} token={token} onAction={load} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
