/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentSession, loginUser, registerUser } from "@/actions/auth";
import SignUp from "@/components/auth/SignUp";
import { redirect } from "next/navigation";

import React from "react";
import z from "zod";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const SignUpPage = async () => {
  const { user } = await getCurrentSession();
  if (user) {
    // Redirect to home page if user is already logged in
    return redirect("/");
  }
  const action = async (prevState: any, formData: FormData) => {
    "use server";
    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        message: "Invalid form data",
      };
    }

    const { email, password } = parsed.data;
    const { user, error } = await registerUser(email, password);
    if (error) {
      return { message: error };
    } else if (user) {
      await loginUser(email, password);
      return redirect("/");
    }
  };
  return <SignUp action={action} />;
};

export default SignUpPage;
