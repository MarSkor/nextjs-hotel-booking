import { after } from "next/server";
import { Navbar, Footer } from "@/components/layout";
import { auth } from "../../../auth";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema/users";

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

  after(async () => {
    if (!session?.user?.id) return;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(user.id, session?.user?.id));
  });

  return (
    <>
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
