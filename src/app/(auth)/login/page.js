import { signIn } from "@/auth";
import { Container } from "@mantine/core";
import { AuthError } from "next-auth";

const SIGNIN_ERROR_URL = "/error";

const LoginPage = async () => {
  return (
    <Container
      component="section"
      size="xl"
      className="auth-pages"
      mt="lg"
      mb="lg"
    >
      <form
        action={async () => {
          "use server";
          try {
            await signIn("google");
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            }
            throw error;
          }
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    </Container>
  );
};

export default LoginPage;
