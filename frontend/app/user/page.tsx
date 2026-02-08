"use client";

import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { wagmiConfig } from "../../lib/wagmi";
import RequestForm from "../../components/RequestForm";
import RequestStatus from "../../components/RequestStatus";
import ScoreCard from "../../components/ScoreCard";
import QuotePanel from "../../components/QuotePanel";

const queryClient = new QueryClient();

export default function UserPage() {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | undefined>(undefined);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f7f7f2 0%, #e6f4f1 45%, #e6eefb 100%)",
            py: 6,
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3}>
              <Typography variant="h3">CredLink User</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RequestForm onCreated={(id) => setRequestId(id)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  {requestId ? (
                    <RequestStatus
                      requestId={requestId}
                      onScored={(walletAddress) => setWallet(walletAddress)}
                    />
                  ) : null}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ScoreCard wallet={wallet} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <QuotePanel wallet={wallet} />
                </Grid>
              </Grid>
            </Stack>
          </Container>
        </Box>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
