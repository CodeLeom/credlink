"use client";

import { useEffect, useState } from "react";
import { getRequestStatus } from "../lib/api";

type Props = {
  requestId: string;
  onScored: (wallet: string, txHash?: string) => void;
};

export default function RequestStatus({ requestId, onScored }: Props) {
  const [status, setStatus] = useState<string>("PENDING");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [wallet, setWallet] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const data = await getRequestStatus(requestId);
        if (!active) return;
        setStatus(data.status);
        setTxHash(data.txHash);
        setWallet(data.wallet);
        if (data.status === "SCORED" && data.wallet) {
          onScored(data.wallet, data.txHash);
        }
      } catch (error) {
        if (!active) return;
        setStatus("FAILED");
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [requestId, onScored]);

  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 12 }}>
      <h3>Status</h3>
      <p>Request ID: {requestId}</p>
      <p>Status: {status}</p>
      {txHash ? <p>Tx: {txHash}</p> : null}
      {wallet ? <p>Wallet: {wallet}</p> : null}
    </div>
  );
}
