import { after } from "next/server";
import { Navbar, Footer } from "@/components/layout";
import { auth } from "../../../auth";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema/users";

export const metadata = {
  title: "Holidaze Booking",
  description:
    "A demo of a accommodation booking web app. Discover Hotels, B&B and guesthouses in Bergen.",
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
      .where(eq(users.id, session?.user?.id));
  });

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
