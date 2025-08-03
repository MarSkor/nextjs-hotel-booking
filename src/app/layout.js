import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "../styles/main.scss";
import { theme } from "@/lib/mantineTheme";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

export default async function RootLayout({ children }) {
  const session = auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body>
          <MantineProvider theme={theme}>
            {children}
            <Toaster />
          </MantineProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
