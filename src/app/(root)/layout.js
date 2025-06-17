import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "../../styles/main.scss";
import { Navbar, Footer } from "@/components/layout";
import { theme } from "../../lib/mantineTheme";

// https://nextjs.org/docs/app/getting-started/metadata-and-og-images#generated-metadata
export const metadata = {
  // metadataBase: new URL(),
  title: "Holidaze Booking",
  description: "Discover Hotels, B&B and guesthouses in Bergen.",
  // keywords: [],
  // authors: [
  //   {name: "",
  //     url: ""
  //   }
  // ],
  // creator: "",
  // manifest: "",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
