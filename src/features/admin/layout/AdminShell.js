"use client";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, AppShellMain, AppShellFooter } from "@mantine/core";
import { Sidebar, Header } from "@/features/admin/layout";

const AdminLayout = ({ children, session }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      layout="alt"
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 240 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <Header opened={opened} onClick={toggle} session={session} />
      <Sidebar opened={opened} onClick={toggle} session={session} />
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
};
export default AdminLayout;
