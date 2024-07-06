"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { FileImage, LoaderCircle, LogOut, Plus, X } from "lucide-react";
import NextLink from "next/link";
import { FC, useRef, useState } from "react";

import { addAction } from "@/actions/add-action";
import { logoutAction } from "@/actions/logout-action";
import { SearchInput } from "@/components/SearchInput";
import { Logo } from "@/components/icons";
import { sleep } from "@/lib/util";
import { Textarea } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const UploadButton: FC<ButtonProps> = ({ isDisabled }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      startContent={pending ? <LoaderCircle className="animate-spin" /> : null}
      type="submit"
      isDisabled={pending || isDisabled}
    >
      Добавить
    </Button>
  );
};

const CancelButton: FC<ButtonProps> = ({ isDisabled }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="button" color="danger" isDisabled={pending || isDisabled}>
      Отмена
    </Button>
  );
};

const SelectButton: FC<ButtonProps> = ({ isDisabled, ...props }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      startContent={<FileImage />}
      type="button"
      isDisabled={pending || isDisabled}
      {...props}
    >
      Выберите файл
    </Button>
  );
};

const ResetButton: FC<ButtonProps> = ({ isDisabled, ...props }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="button"
      isIconOnly
      isDisabled={pending || isDisabled}
      {...props}
    >
      <X />
    </Button>
  );
};

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const navigator = useRouter();

  const close = () => {
    setDescription("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onClose();
  };

  const action = async (data: FormData) => {
    await addAction(data);
    await sleep(900);
    close();
    navigator.refresh();
  };

  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        />

        <NavbarItem>
          <SearchInput />
        </NavbarItem>

        <NavbarItem>
          <Button isIconOnly onClick={onOpen}>
            <Plus />
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            onClick={async () => {
              await logoutAction();
              navigator.push("/login");
            }}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </NavbarItem>
      </NextUINavbar>

      <Modal isOpen={isOpen} onClose={close}>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <form action={action}>
            <ModalBody>
              <img
                alt="image"
                height={150}
                src={file ? URL.createObjectURL(file) : "/default-image.svg"}
                width={150}
                className="mx-auto rounded"
              />

              <Textarea
                className="mb-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name="description"
              />
              <div className="flex gap-3 justify-center">
                <SelectButton onClick={() => inputRef.current?.click()} />
                <ResetButton
                  onClick={() => {
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                />
              </div>
              <input
                ref={inputRef}
                accept="image/*"
                className="hidden"
                id="image"
                name="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </ModalBody>
            <ModalFooter>
              <CancelButton />
              <UploadButton isDisabled={!file} />
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
