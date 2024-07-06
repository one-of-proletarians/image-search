"use client";

import { Button } from "@nextui-org/button";
import { LoaderCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { sleep } from "openai/core";
import { FC, useState } from "react";

interface DeleteButtonProps {
  action: (id: string, url: string) => Promise<void>;
  id: string;
  url: string;
}
export const DeleteButton: FC<DeleteButtonProps> = ({ action, id, url }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      isIconOnly
      color="danger"
      size="sm"
      className="absolute top-2 right-2"
      isDisabled={pending}
      onClick={async () => {
        setPending(true);
        await sleep(500);
        action(id, url).finally(router.refresh);
      }}
    >
      {pending ? (
        <LoaderCircle className="animate-spin w-4 h-4" />
      ) : (
        <Trash className="w-4 h-4" />
      )}
    </Button>
  );
};
