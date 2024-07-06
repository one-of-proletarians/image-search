"use client";
import { Input } from "@nextui-org/input";
import { FC, useState } from "react";

import { SearchIcon } from "@/components/icons";
import { Search } from "lucide-react";

export const SearchInput: FC = () => {
  const [value, setValue] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `/search?q=${value}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100 pr-1",
          input: "text-sm",
        }}
        endContent={
          <button type="submit" className="p-2 rounded hover:bg-[#27272A]">
            <Search className="cursor-pointer w-4 h-4" />
          </button>
        }
        labelPlacement="outside"
        placeholder="Поиск..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value.trimStart())}
      />
    </form>
  );
};
