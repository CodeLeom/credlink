"use client";

import { Box, Container, Stack, Typography, Alert } from "@mui/material";
import AdminTable from "../../components/AdminTable";

export default function AdminPage() {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f7f7f2 0%, #f3efe7 45%, #eef6f4 100%)",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Typography variant="h3">CredLink Admin</Typography>
            <Alert severity="info">
              Enter the admin token to view and
              manage requests.
            </Alert>
            <AdminTable />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
