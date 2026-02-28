"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getRequestStatus } from "../lib/api";
import { useNotification } from "./NotificationProvider";

export default function RequestLookup() {
  const [requestId, setRequestId] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { notify } = useNotification();

  const handleLookup = async () => {
    if (!requestId.trim()) {
      setError("Please enter a request ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getRequestStatus(requestId);
      setStatus(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request not found";
      setError(msg);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e9e9e2" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Look Up Your Request</Typography>
          <Typography variant="body2" color="textSecondary">
            Enter your request ID to check the status and view your score.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Request ID"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLookup()}
              placeholder="e.g., 3bbc30cb-db37-47c3..."
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleLookup}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={20} /> : "Search"}
            </Button>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          {status && (
            <Box sx={{ pt: 2, borderTop: "1px solid #e9e9e2" }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Request Details
              </Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Request ID
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                      {status.id}
                    </code>
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(status.id);
                        notify({ message: "Copied request ID" });
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={status.status}
                    color={
                      status.status === "PENDING"
                        ? "warning"
                        : status.status === "SCORED"
                          ? "success"
                          : status.status === "FAILED"
                            ? "error"
                            : status.status === "APPROVED"
                              ? "info"
                              : "default"
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                {status.score !== null && status.score !== undefined && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Credit Score
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1b6b4a" }}>
                      {status.score}
                    </Typography>
                  </Box>
                )}

                {status.txHash && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      On-Chain Transaction Hash
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                        {status.txHash}
                      </code>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(status.txHash);
                          notify({ message: "Copied transaction hash" });
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                )}

                {status.wallet && (
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Wallet Address
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
                        {status.wallet}
                      </code>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(status.wallet);
                          notify({ message: "Copied wallet address" });
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
