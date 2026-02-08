"use client";

import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
        <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
          <h1>CredLink User</h1>
          <RequestForm onCreated={(id) => setRequestId(id)} />
          {requestId ? (
            <div style={{ marginTop: 16 }}>
              <RequestStatus
                requestId={requestId}
                onScored={(walletAddress) => setWallet(walletAddress)}
              />
            </div>
          ) : null}
          <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
            <ScoreCard wallet={wallet} />
            <QuotePanel wallet={wallet} />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
