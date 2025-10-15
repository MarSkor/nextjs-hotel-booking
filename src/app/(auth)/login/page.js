"use client";

import { AuthForm } from "@/features/auth/forms";
import { loginWithCredentials } from "@/actions/auth";
import { loginSchema } from "@/lib/validations";

const LoginPage = () => (
  <AuthForm
    type="LOGIN"
    schema={loginSchema}
    defaultValues={{ email: "", password: "" }}
    handleFormonSubmit={loginWithCredentials}
  />
);

export default LoginPage;
