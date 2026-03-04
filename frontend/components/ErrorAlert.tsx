"use client";

import { useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type Severity = "error" | "warning" | "info";

type Props = {
  message: string;
  severity?: Severity;
  title?: string;
  details?: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  retryLabel?: string;
  compact?: boolean;
};

const severityConfig = {
  error: {
    icon: ErrorOutlineIcon,
    defaultTitle: "Something went wrong",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    textColor: "#991b1b",
  },
  warning: {
    icon: WarningAmberIcon,
    defaultTitle: "Warning",
    bgColor: "#fffbeb",
    borderColor: "#fed7aa",
    textColor: "#92400e",
  },
  info: {
    icon: InfoOutlinedIcon,
    defaultTitle: "Information",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    textColor: "#1e40af",
  },
};

export default function ErrorAlert({
  message,
  severity = "error",
  title,
  details,
  code,
  onRetry,
  onDismiss,
  dismissible = false,
  retryLabel = "Try again",
  compact = false,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (dismissed) return null;

  const config = severityConfig[severity];
  const displayTitle = title || config.defaultTitle;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (compact) {
    return (
      <Alert
        severity={severity}
        sx={{
          borderRadius: 2,
          "& .MuiAlert-message": { width: "100%" },
        }}
        action={
          <Stack direction="row" spacing={0.5}>
            {onRetry && (
              <IconButton size="small" onClick={onRetry} color="inherit">
                <RefreshIcon fontSize="small" />
              </IconButton>
            )}
            {dismissible && (
              <IconButton size="small" onClick={handleDismiss} color="inherit">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        }
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="body2">{message}</Typography>
          {code && (
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                bgcolor: "rgba(0,0,0,0.08)",
                borderRadius: 1,
                fontFamily: "monospace",
              }}
            >
              {code}
            </Typography>
          )}
        </Stack>
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${config.borderColor}`,
        bgcolor: config.bgColor,
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <config.icon sx={{ color: config.textColor, mt: 0.25 }} />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: config.textColor, fontWeight: 600 }}
              >
                {displayTitle}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: config.textColor, opacity: 0.9, mt: 0.5 }}
              >
                {message}
              </Typography>
              {code && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-block",
                    mt: 1,
                    px: 1,
                    py: 0.25,
                    bgcolor: "rgba(0,0,0,0.06)",
                    borderRadius: 1,
                    fontFamily: "monospace",
                    color: config.textColor,
                  }}
                >
                  Error code: {code}
                </Typography>
              )}
            </Box>
          </Stack>
          {dismissible && (
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{ color: config.textColor, opacity: 0.7 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        {details && (
          <>
            <Button
              size="small"
              onClick={() => setShowDetails(!showDetails)}
              startIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                alignSelf: "flex-start",
                color: config.textColor,
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              {showDetails ? "Hide details" : "Show details"}
            </Button>
            <Collapse in={showDetails}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "rgba(0,0,0,0.04)",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: config.textColor,
                }}
              >
                {details}
              </Box>
            </Collapse>
          </>
        )}

        {onRetry && (
          <Button
            variant="outlined"
            size="small"
            onClick={onRetry}
            startIcon={<RefreshIcon />}
            sx={{
              alignSelf: "flex-start",
              borderColor: config.textColor,
              color: config.textColor,
              "&:hover": {
                borderColor: config.textColor,
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            {retryLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
