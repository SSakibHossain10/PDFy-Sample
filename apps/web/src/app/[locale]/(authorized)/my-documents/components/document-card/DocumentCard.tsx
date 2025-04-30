"use client";

import { IGetUserDocumentsResponse } from "@/app/api/document/get-user-documents/[userId]/route";
import usePopover from "@/hooks/usePopover";
import Link from "next/link";
import { TfiMoreAlt } from "react-icons/tfi";
import DocumentModal from "./DocumentModal";

const DocumentCard = ({
  document,
  display,
}: {
  document: IGetUserDocumentsResponse;
  display: "inside-category" | "independent";
}) => {
  const documentModalPopover = usePopover<HTMLDialogElement>();

  return (
    <div
      className={`shrink-0 snap-center bg-primary-100/10 flex items-center ${display === "independent" ? "w-full" : "w-[31%] sm:w-[22.5%] md:w-[18%] lg:w-[15%]"} h-full relative`}
    >
      <DocumentModal myPopover={documentModalPopover} document={document} />

      <button
        className="absolute top-2 right-2 px-2 py-1.5 bg-primary-900/50 active:bg-primary-900/30 text-primary-50 rounded-md"
        popoverTarget={documentModalPopover.popoverTarget}
        onClick={(e) => {
          e.preventDefault();
          documentModalPopover.popoverRef.current.showPopover();
        }}
      >
        <TfiMoreAlt className="size-3" />
      </button>
      <small className="absolute bottom-2 left-2 px-2 py-1 font-black bg-primary-100/50 text-primary-700 border border-primary-700 rounded-full">
        {document.pages.length}
      </small>
      <Link href={`/document/${document._id}/edit`} className="max-w-full">
        <img
          loading="lazy"
          src={document.pages[0].thumbnail}
          key={document._id}
          alt={`${document.name} thumbnail`}
          width={document.pages[0].width}
          height={document.pages[0].height}
          className="bg-primary-100/15"
        />
      </Link>
    </div>
  );
};

export default DocumentCard;
