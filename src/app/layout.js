import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "../styles/main.scss";
import { theme } from "@/lib/mantineTheme";
import NextAuthProvider from "./NextAuthProvider";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <MantineProvider theme={theme}>
            <Notifications
              position="top-center"
              limit={3}
              zIndex={9999}
              autoClose={6000}
            />
            <ModalsProvider>{children}</ModalsProvider>
          </MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
