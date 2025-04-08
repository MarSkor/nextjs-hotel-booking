import React from "react";
import { signIn } from "@/actions/auth";

const LoginPage = () => {
  return (
    <div>
      <h2>placeholder login form</h2>
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

export default LoginPage;
