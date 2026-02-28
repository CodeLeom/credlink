import type { ReactNode } from "react";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import AppThemeProvider from "../components/AppThemeProvider";
import AppProviders from "../components/AppProviders";

export const metadata = {
  title: "CredLink",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          {/* notifications and navigation are provided by a client component */}
          <AppProviders>{children}</AppProviders>
        </AppThemeProvider>
      </body>
    </html>
  );
}
