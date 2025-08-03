import { Navbar, Footer } from "@/components/layout";
import { auth } from "../../../auth";

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

const PublicLayout = async ({ children }) => {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
