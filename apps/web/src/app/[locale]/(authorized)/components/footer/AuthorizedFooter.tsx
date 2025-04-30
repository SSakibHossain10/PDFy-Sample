import { DEFAULT_AVATAR } from "@/constants";
import Link from "next/link";
import { Suspense } from "react";
import { HiTemplate } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import ProfileIcn from "./ProfileIcn";
import UploadPdf from "./UploadPdf";

const AuthorizedFooter = () => {
  return (
    <footer
      className="sm:invisible sm:h-0 overflow-hidden shrink-0 h-12 bg-primary-50/10 grid grid-cols-5 gap-2 px-2 border-t border-primary-200/5"
      id="authorized-layout-footer"
    >
      <Link
        prefetch
        href="/dashboard"
        className="w-fit mx-auto h-full px-3 pt-1.75 flex flex-col items-center rounded-t-2xl"
      >
        <IoMdHome className="size-5.25" />

        <div className="grow flex flex-col items-center justify-evenly gap-0.5">
          <span className="font-semibold">Home</span>
          <span
            className="w-full bg-primary-300 rounded-t h-0 opacity-0 transition-[height]"
            id="dashboard-page-nav-button"
          />
        </div>
      </Link>

      <Link
        prefetch
        href="/templates"
        className="w-fit mx-auto h-full pt-1.75 flex flex-col items-center rounded-t-2xl"
      >
        <HiTemplate className="size-5.25" />

        <div className="grow flex flex-col items-center justify-evenly gap-0.5">
          <span className="font-semibold">Templates</span>
          <span
            className="w-full bg-primary-300 rounded-t h-0 opacity-0 transition-[height]"
            id="template-page-nav-button"
          />
        </div>
      </Link>

      <UploadPdf />

      <Link
        prefetch
        href="/my-documents"
        className="w-fit mx-auto h-full pt-1.75 flex flex-col items-center rounded-t-2xl"
      >
        <IoDocumentText className="size-5.25 p-0.25" />

        <div className="grow flex flex-col items-center justify-evenly gap-0.5">
          <span className="font-semibold text-nowrap">My documents</span>
          <span
            className="w-full bg-primary-300 rounded-t h-0 opacity-0 transition-[height]"
            id="my-documents-page-nav-button"
          />
        </div>
      </Link>

      <Link prefetch href="/account" className="w-fit mx-auto h-full pt-1.75 flex flex-col items-center rounded-t-2xl">
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
        <div className="grow flex flex-col items-center justify-evenly gap-0.5">
          <span className="font-semibold">Account</span>

          <span
            className="w-full bg-primary-300 rounded-t h-0 opacity-0 transition-[height]"
            id="account-page-nav-button"
          />
        </div>
      </Link>
    </footer>
  );
};

export default AuthorizedFooter;
