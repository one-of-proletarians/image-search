"use client";

import { IRecord } from "@/app/(index)/page";
import { FC } from "react";
import { DeleteButton } from "./DeleteButton";

interface ItemProps {
  r: IRecord;
  deleteAction: (id: string, url: string) => Promise<void>;
}

export const Item: FC<ItemProps> = ({ r, deleteAction }) => {
  return (
    <li className="flex gap-2 rounded bg-slate-800 p-2 hover:bg-slate-700 cursor-pointer transition-colors relative">
      <img
        src={r.url}
        alt={r.description}
        className="rounded min-w-60 w-60 max-h-48 object-cover"
      />

      <p>{r.description}</p>
      <DeleteButton action={deleteAction} id={r.id} url={r.url} />
    </li>
  );
};
