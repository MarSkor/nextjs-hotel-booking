import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/features/admin/layout";

const Layout = async ({ children }) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") redirect("/login");

  return <AdminShell session={session}>{children}</AdminShell>;
};

export default Layout;
