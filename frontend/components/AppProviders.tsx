"use client";

import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";
import { NotificationProvider } from "./NotificationProvider";
import Navbar from "./Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const globalQueryClient = new QueryClient();

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={globalQueryClient}>
      <WagmiProvider config={wagmiConfig}>
        <NotificationProvider>
          <Navbar />
          {children}
        </NotificationProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
