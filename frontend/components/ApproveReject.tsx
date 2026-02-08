"use client";

import { useState } from "react";
import { approveRequest, rejectRequest } from "../lib/api";

type Props = {
  id: string;
  token: string;
  onAction: () => void;
};

export default function ApproveReject({ id, token, onAction }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (action: "approve" | "reject") => {
    setLoading(true);
    setError("");
    try {
      if (action === "approve") {
        await approveRequest(id, token);
      } else {
        await rejectRequest(id, token);
      }
      onAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handle("approve")} disabled={loading}>
        Approve
      </button>
      <button onClick={() => handle("reject")} disabled={loading} style={{ marginLeft: 8 }}>
        Reject
      </button>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </div>
  );
}
