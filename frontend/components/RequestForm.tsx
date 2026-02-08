"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { createRequest } from "../lib/api";

type Props = {
  onCreated: (id: string) => void;
};

export default function RequestForm({ onCreated }: Props) {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createRequest({ userEmail: email, wallet: address });
      onCreated(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
      <h2>User Request</h2>
      <div style={{ marginBottom: 12 }}>
        {isConnected ? (
          <div>
            <div style={{ marginBottom: 8 }}>Wallet: {address}</div>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <button onClick={() => connect({ connector: injected() })} disabled={isPending}>
            Connect Wallet
          </button>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Request Score"}
      </button>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </div>
  );
}
