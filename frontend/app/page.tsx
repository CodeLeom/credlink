import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f7f2 0%, #e6f4f1 45%, #e6eefb 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Typography variant="h2">CredLink</Typography>
          <Typography>
            On-chain credit bureau with admin approval, CRE scoring, and DeFi loan quoting.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" href="/user">
              User Portal
            </Button>
            <Button variant="outlined" href="/admin">
              Admin Portal
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
