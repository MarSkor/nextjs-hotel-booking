import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/features/admin/layout";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema/users";
import { eq } from "drizzle-orm";

const Layout = async ({ children }) => {
  const session = await auth();

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!isAdmin) redirect("/");

  return <AdminShell session={session}>{children}</AdminShell>;
};

export default Layout;
