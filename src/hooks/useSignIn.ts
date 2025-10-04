"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const loginFormSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});

type LoginFormFields = yup.InferType<typeof loginFormSchema>;

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginFormFields>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.ok) {
        // Redirect to home page
        router.push("/");
      } else {
        alert(res?.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useSignIn;