import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Box, Flex } from "@mantine/core";
import { IconArrowLeft } from "@/components/icons";
import { auth } from "../../../auth";

export const metadata = {
  title: "Create or Login | Holidaze",
  description:
    "Create an account or login to your already existing Holidaze account",
};

const AuthLayout = async ({ children }) => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <main>
      <Flex direction={{ base: "column-reverse", sm: "row" }}>
        <Box component="article" className="auth-pages__form-wrapper">
          <Link href={"/"} className="auth-pages__return-link">
            <IconArrowLeft />
            Return to Holidaze
          </Link>
          <Flex
            component="section"
            justify={"center"}
            align={"center"}
            direction={"column"}
            className="auth-pages__form-content"
            p={"md"}
          >
            {children}
          </Flex>
        </Box>
        <Box component="section" className="auth-pages__illustration">
          <Image
            src={"/assets/auth/auth-login.jpg"}
            alt="auth image"
            height={1000}
            width={1000}
            className="auth-pages__illustration--image"
          />
        </Box>
      </Flex>
    </main>
  );
};

export default AuthLayout;
