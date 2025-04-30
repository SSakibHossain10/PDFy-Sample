"use client";

import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import pdfParseAndUpload from "../../pdf-editor/utils/pdfParseAndUpload";

const UploadPdf = () => {
  const uploadInput = useRef<HTMLInputElement>(null);
  const progressDialog = useRef<HTMLDialogElement>(null);

  const searchParams = useSearchParams();
  const share_target = searchParams.get("share-target");

  const [status, setStatus] = useState<"Parsing..." | "Uploading..." | "Redirecting...">("Parsing...");

  const handleUploadProgress = (data: Parameters<typeof pdfParseAndUpload>[0]) => {
    setStatus("Parsing...");
    progressDialog.current?.showPopover();
    pdfParseAndUpload(data, setStatus);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadProgress(e.target.files?.[0]);
  };

  const handlePickDocument = () => {
    uploadInput.current?.click();
  };

  //file_handlers
  useEffect(() => {
    if ("launchQueue" in window) {
      (window as any).launchQueue.setConsumer((launchParams: { files: string | any[] }) => {
        if (launchParams.files && launchParams.files.length) {
          handleUploadProgress(launchParams.files[0]);
        }
      });
    }
  }, []);

  //share_target
  useEffect(() => {
    if (share_target) {
      (async () => {
        const keys = await caches.keys();
        const mediaCache = await caches.open(keys.filter((key) => key.startsWith("media"))[0]);
        const pdf = await mediaCache.match("shared-pdf");
        if (pdf) {
          console.log("Shared PDF found in cache", pdf);

          console.log("file name", share_target);

          const blob = await pdf.blob();

          handleUploadProgress({
            name: share_target || "shared-pdf",
            type: "blob",
            size: blob.size,
            blob,
          });

          console.log("Shared PDF blob", blob);

          await mediaCache.delete("shared-pdf");
          // Handle the shared file somehow.
        }
      })();
    }
  }, [share_target]);

  console.log("share_target", share_target);

  return (
    <>
      <button
        className="w-fit m-auto p-3 bg-primary-200/10 active:text-primary-500 rounded-full shadow"
        onClick={handlePickDocument}
      >
        <input
          ref={uploadInput}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
          id="upload-pdf-input"
        />
        <FaPlus className="size-4" />
      </button>
      <dialog
        popover="auto"
        ref={progressDialog}
        style={{
          visibility: "initial",
        }}
        className="bg-gradient-to-b from-[#18383f] to-[#182d41] text-primary-300 min-w-dvw min-h-dvh open:flex flex-col items-center justify-center gap-2 p-6 overflow-hidden"
      >
        <div
          className="left-5 right-5 absolute m-auto bg-primary-50/5 flex flex-col items-center justify-center gap-2 p-2 aspect-square rounded-full border-l border-primary-300/50 animate-spin"
          style={{
            maxWidth: "calc(min(100dvw, 500px) - 40px)",
            maxHeight: "calc(min(100dvh, 500px) - 40px)",
          }}
        />

        <h5>{status}</h5>

        <div className="w-full max-w-40 h-1 bg-black/20 rounded-full relative overflow-hidden">
          <div className="absolute h-full w-1/2 bg-primary-300/50 rounded-full pdf-parse-progress-bar"></div>
        </div>
      </dialog>
    </>
  );
};

export default UploadPdf;
