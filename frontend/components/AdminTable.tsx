"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import { listAdminRequests } from "../lib/api";
import ApproveReject from "./ApproveReject";
import { useNotification } from "./NotificationProvider";

export type RequestRow = {
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
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || process.env.ADMIN_TOKEN || "",
  );
  const { notify } = useNotification();

  const load = async () => {
    try {
      const result = await listAdminRequests("PENDING", token);
      setRequests(result.requests || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      setError(msg);
      notify({ message: msg, severity: "error" });
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Pending Requests</Typography>
            <Button size="small" onClick={load} variant="outlined">
              Refresh
            </Button>
          </Stack>
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
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Wallet</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} hover>
                      <TableCell>{req.id}</TableCell>
                      <TableCell>{req.userEmail}</TableCell>
                      <TableCell>{req.wallet}</TableCell>
                      <TableCell>
                        {new Date(req.createdAt * 1000).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(req.updatedAt * 1000).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <ApproveReject
                          id={req.id}
                          token={token}
                          onAction={load}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
