"use client";

import { useEffect, useState } from "react";
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
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
      <h2>Pending Requests</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {requests.length === 0 ? <p>No pending requests.</p> : null}
      {requests.map((req) => (
        <div key={req.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
          <p>ID: {req.id}</p>
          <p>Email: {req.userEmail}</p>
          <p>Wallet: {req.wallet}</p>
          <ApproveReject id={req.id} token={token} onAction={load} />
        </div>
      ))}
    </div>
  );
}
