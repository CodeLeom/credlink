"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminTable from "../../components/AdminTable";

const queryClient = new QueryClient();

export default function AdminPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
        <h1>CredLink Admin</h1>
        <AdminTable />
      </div>
    </QueryClientProvider>
  );
}
