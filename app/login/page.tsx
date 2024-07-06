"use client";

import { loginAction } from "@/actions/login-action";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState(false);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        action={async (fd) => {
          setError(false);
          const result = await loginAction(fd);
          if (result) redirect("/");
          else setError(true);
        }}
        className="flex flex-col gap-2 p-4"
      >
        <Input
          errorMessage="Не верный логин"
          isRequired
          placeholder="Login"
          name="login"
          type="text"
          minLength={5}
          isInvalid={error}
          autoFocus
        />

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
