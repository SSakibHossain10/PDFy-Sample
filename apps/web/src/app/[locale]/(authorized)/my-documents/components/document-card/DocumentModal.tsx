import { IGetUserDocumentsResponse } from "@/app/api/document/get-user-documents/[userId]/route";
import SlideLeftBtn from "@/components/SlideLeftBtn";
import SlideRightBtn from "@/components/SlideRightBtn";
import { IPopover } from "@/hooks/usePopover";
import deleteDocument from "@/server-actions/delete_document";
import duplicateDocument from "@/server-actions/duplicate_document";
import clientNotification from "@/utils/clientNotification";
import CloseIcn from "@icons/doutone/close-circle.svg";
import Form from "next/form";
import DeleteDocumentBtn from "./DeleteDocumentBtn";
import DuplicateDocumentBtn from "./DuplicateDocumentBtn";

export type TUseType = "in-document" | "new-document";

const DocumentModal = ({
  myPopover,
  document,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  document: IGetUserDocumentsResponse;
}) => {
  return (
    <dialog
      popover="auto"
      id={myPopover.id}
      className="popover-animation-opacity m-auto inset-0 relative overflow-hidden shadow-xl rounded-2xl open:[&+*]:bg-forground/15 backdrop:bg-white/10"
      style={{ maxWidth: "calc(min(100dvw, 600px) - 5px)", maxHeight: "calc(100dvh - 5px)" }}
      ref={myPopover.popoverRef}
    >
      <button
        className="p-1.5 absolute right-0.5 top-0.5"
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
      >
        <CloseIcn className="size-8 active:text-primary-500" />
      </button>
      <div className="bg-gr-multi-dark flex flex-col items-stretch rounded-2xl overflow-auto max-h-dvh">
        <h5 className="px-6 text-center m-5">{document.name}</h5>

        <div className="flex gap-2 mx-auto px-5 overflow-x-auto scrollbar-hidden snap-x snap-mandatory scroll-smooth">
          <SlideLeftBtn className="-ml-2 -translate-x-5" />

          {document.pages.map(({ thumbnail, width, height }, indx) => (
            <img
              key={thumbnail}
              loading="lazy"
              src={thumbnail}
              alt={`${document.name} thumbnail ${indx + 1}`}
              className="snap-center w-auto h-70 bg-primary-100/25"
              style={{ aspectRatio: `${width}/${height}` }}
            />
          ))}

          <SlideRightBtn className="-ml-2 -translate-x-2" />
        </div>

        <div className="flex justify-center gap-3 p-3">
          <Form
            action={(e) =>
              duplicateDocument(e).then((res) => {
                myPopover.popoverRef.current.hidePopover();
                clientNotification(res);
              })
            }
          >
            <input type="text" readOnly name="documentId" value={document._id} className="hidden" />{" "}
            <DuplicateDocumentBtn />
          </Form>

          <Form
            action={(e) =>
              deleteDocument(e).then((res) => {
                myPopover.popoverRef.current.hidePopover();
                clientNotification(res);
              })
            }
          >
            <input type="text" readOnly name="documentId" value={document._id} className="hidden" />{" "}
            <DeleteDocumentBtn />
          </Form>
        </div>
      </div>
    </dialog>
  );
};

export default DocumentModal;
