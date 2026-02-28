import type { ReactNode } from "react";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import AppThemeProvider from "../components/AppThemeProvider";
import { NotificationProvider } from "../components/NotificationProvider";
import Navbar from "../components/Navbar";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

export const metadata = {
  title: "CredLink",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          {/* notifications and navigation are global */}
          <NotificationProvider>
            <WagmiProvider config={wagmiConfig}>
              <Navbar />
              {children}
            </WagmiProvider>
          </NotificationProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
