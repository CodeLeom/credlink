export type CreateRequestPayload = {
  userEmail: string;
  wallet: string;
};

export type RequestStatusResponse = {
  id: string;
  wallet: string;
  status: string;
  score?: number;
  txHash?: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const createRequest = async (payload: CreateRequestPayload) => {
  const response = await fetch(`${apiUrl}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to create request");
  }
  return response.json();
};

export const getRequestStatus = async (id: string): Promise<RequestStatusResponse> => {
  const response = await fetch(`${apiUrl}/requests/${id}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Request not found");
  }
  return response.json();
};

export const listAdminRequests = async (status?: string, token?: string) => {
  const resolvedToken =
    token || process.env.NEXT_PUBLIC_ADMIN_TOKEN || process.env.ADMIN_TOKEN || "";
  const url = status ? `${apiUrl}/admin/requests?status=${status}` : `${apiUrl}/admin/requests`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${resolvedToken}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to load requests");
  }
  return response.json();
};

export const approveRequest = async (id: string, token?: string) => {
  const resolvedToken =
    token || process.env.NEXT_PUBLIC_ADMIN_TOKEN || process.env.ADMIN_TOKEN || "";
  const response = await fetch(`${apiUrl}/admin/requests/${id}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${resolvedToken}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Approve failed");
  }
  return response.json();
};

export const rejectRequest = async (id: string, token?: string) => {
  const resolvedToken =
    token || process.env.NEXT_PUBLIC_ADMIN_TOKEN || process.env.ADMIN_TOKEN || "";
  const response = await fetch(`${apiUrl}/admin/requests/${id}/reject`, {
    method: "POST",
    headers: { Authorization: `Bearer ${resolvedToken}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Reject failed");
  }
  return response.json();
};
