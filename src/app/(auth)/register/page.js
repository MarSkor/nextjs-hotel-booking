"use client";
import { AuthForm } from "@/features/auth/forms";
import { register } from "@/actions/auth";
import { registerSchema } from "@/lib/validations";

const RegisterPage = () => (
  <AuthForm
    type="REGISTER"
    schema={registerSchema}
    defaultValues={{ fullName: "", email: "", password: "" }}
    handleFormOnSubmit={register}
  />
);

export default RegisterPage;
