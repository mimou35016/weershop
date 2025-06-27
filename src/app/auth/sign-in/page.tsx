/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentSession, loginUser } from "@/actions/auth";
import SignIn from "@/components/auth/SignIn";
import { redirect } from "next/navigation";

import React from "react";
import z from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const SignInPage = async () => {
  const { user } = await getCurrentSession();
  if (user) {
    // Redirect to home page if user is already logged in
    return redirect("/");
  }
  const action = async (prevState: any, formData: FormData) => {
    "use server";
    const parsed = SignInSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        message: "Invalid form data",
      };
    }

    const { email, password } = parsed.data;
    const { user, error } = await loginUser(email, password);
    if (error) {
      return { message: error };
    } else if (user) {
      return redirect("/");
    }
  };
  return <SignIn action={action} />;
};

export default SignInPage;
