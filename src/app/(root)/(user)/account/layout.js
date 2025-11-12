import { Container } from "@mantine/core";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { UserBreadCrumb } from "@/components/ui";

const UserLayout = async ({ children }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Container
      component="section"
      size="sm"
      className="account__col-wrapper"
      pt={"sm"}
      pb={"sm"}
    >
      <UserBreadCrumb />
      {children}
    </Container>
  );
};

export default UserLayout;
