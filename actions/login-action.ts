"use server";
import { cookies } from "next/headers";

const LOGIN = process.env.LOGIN!;

export const loginAction = async (formData: FormData) => {
  const login = formData.get("login") as string;

  if (login === LOGIN) {
    cookies().set({
      name: "Authorization",
      value: login,
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    return true;
  }

  return false;
};
