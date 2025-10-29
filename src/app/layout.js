import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "../styles/main.scss";
import { theme } from "@/lib/mantineTheme";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

export default async function RootLayout({ children }) {
  const session = auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body>
          <MantineProvider theme={theme}>
            <Notifications
              position="top-center"
              limit={3}
              zIndex={9999}
              autoClose={6000}
            />
            <ModalsProvider>{children}</ModalsProvider>
          </MantineProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
