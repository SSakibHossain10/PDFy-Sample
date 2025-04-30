import { DEFAULT_AVATAR, PDFY_LOGO } from "@/constants";
import Link from "next/link";
import { Suspense } from "react";
import { HiTemplate } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";
import ProfileIcn from "../footer/ProfileIcn";
import Upload from "./Upload";

const AuthorizedHeader = () => {
  return (
    <header
      className="shrink-0 h-12 bg-primary-50/10 flex items-center px-2 border-b border-primary-200/5"
      id="authorized-layout-header"
    >
      <Link
        href="/"
        className="px-4 py-1.5 flex items-center gap-1 rounded-xl hover:bg-forground/10 active:text-primary-500"
      >
        <img
          loading="lazy" //lazy used for case it is hidden (header hidden)
          src={PDFY_LOGO}
          alt="PDFy"
          width={25}
          height={25}
        />

        <p className="font-medium">PDFy</p>
      </Link>

      <Link
        prefetch
        href="/templates"
        id="template-page-nav"
        className="sx:hidden px-4 py-2 flex items-center gap-1 rounded-xl hover:bg-forground/10 active:text-primary-500"
      >
        <HiTemplate className="size-5.25" />

        <p className="font-medium">Templates</p>
      </Link>

      <Link
        prefetch
        href="/my-documents"
        id="my-documents-page-nav"
        className="sx:hidden px-4 py-2 flex items-center gap-1 rounded-xl hover:bg-forground/10 active:text-primary-500"
      >
        <IoDocumentText className="size-5.25 p-0.25" />

        <p className="font-medium">My documents</p>
      </Link>

      <Upload />

      <span className="grow" />

      <Link
        prefetch
        href="/account"
        id="account-page-nav"
        className="sx:hidden px-4 py-2 flex  items-center gap-2 rounded-xl hover:bg-forground/10 active:text-primary-500"
      >
        <Suspense
          fallback={
            <img
              loading="lazy" //lazy used for case it is hidden (header hidden)
              src={DEFAULT_AVATAR}
              alt="Dummy Account Icon"
              width={20}
              height={20}
              className="rounded-full"
            />
          }
        >
          <ProfileIcn />
        </Suspense>
        <p className="font-medium">Account</p>
      </Link>
    </header>
  );
};

export default AuthorizedHeader;
