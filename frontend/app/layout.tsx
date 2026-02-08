import type { ReactNode } from "react";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export const metadata = {
  title: "CredLink",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0f766e" },
    secondary: { main: "#0ea5e9" },
    background: { default: "#f7f7f2", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "\"Space Grotesk\", ui-sans-serif, system-ui",
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
