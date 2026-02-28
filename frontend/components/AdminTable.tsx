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
  Chip,
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { listAdminRequests } from "../lib/api";
import ApproveReject from "./ApproveReject";
import { useNotification } from "./NotificationProvider";

export type RequestRow = {
  id: string;
  userEmail: string;
  wallet: string;
  status: string;
  score?: number | null;
  txHash?: string | null;
  createdAt: number;
  updatedAt: number;
};

function ExpandableRow({
  req,
  token,
  onAction,
}: {
  req: RequestRow;
  token: string;
  onAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { notify } = useNotification();

  return (
    <>
      <TableRow hover>
        <TableCell width="40px">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <code style={{ fontSize: "0.75rem" }}>{req.id.slice(0, 8)}...</code>
        </TableCell>
        <TableCell
          sx={{
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {req.userEmail}
        </TableCell>
        <TableCell>
          <Chip
            label={req.status}
            size="small"
            color={
              req.status === "PENDING"
                ? "warning"
                : req.status === "SCORED"
                  ? "success"
                  : req.status === "FAILED"
                    ? "error"
                    : "default"
            }
          />
        </TableCell>
        <TableCell align="right">
          {req.score !== null && req.score !== undefined ? (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {req.score}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          )}
        </TableCell>
        <TableCell align="right">
          <ApproveReject id={req.id} token={token} onAction={onAction} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Full Details</Typography>
                <Stack direction="row" spacing={2}>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Request ID
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                        {req.id}
                      </code>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(req.id);
                          notify({ message: "Copied request ID" });
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Wallet
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                        {req.wallet}
                      </code>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(req.wallet);
                          notify({ message: "Copied wallet" });
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Stack>
                {req.txHash && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      On-Chain Transaction
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                        {req.txHash}
                      </code>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(req.txHash || "");
                          notify({ message: "Copied txHash" });
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                )}
                {req.score !== null && req.score !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Credit Score
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {req.score}
                    </Typography>
                  </Box>
                )}
                <Stack direction="row" spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(req.createdAt * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(req.updatedAt * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

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
            <TableContainer
              component={Paper}
              sx={{ mt: 2, maxWidth: "100%", overflowX: "visible" }}
            >
              <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafafa" }}>
                    <TableCell width="40px" />
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <ExpandableRow key={req.id} req={req} token={token} onAction={load} />
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
