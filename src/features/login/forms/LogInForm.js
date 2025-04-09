import { signIn } from "@/lib/auth";

const LogInForm = () => {
  return (
    <div>
      <div>Login form here</div>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    </div>
  );
};

export default LogInForm;
