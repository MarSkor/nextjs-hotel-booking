import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "../../styles/main.scss";

export const metadata = {
  title: "Holidaze Booking",
  description: "Discover Hotels, B&B and guesthouses in Bergen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          {/* <Navbar/> */}
          {children}
          {/* <Footer/> */}
        </MantineProvider>
      </body>
    </html>
  );
}
