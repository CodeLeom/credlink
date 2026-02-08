"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, Container, Stack, Typography } from "@mui/material";
import AdminTable from "../../components/AdminTable";

const queryClient = new QueryClient();

export default function AdminPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f7f7f2 0%, #f3efe7 45%, #eef6f4 100%)",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Typography variant="h3">CredLink Admin</Typography>
            <AdminTable />
          </Stack>
        </Container>
      </Box>
    </QueryClientProvider>
  );
}
