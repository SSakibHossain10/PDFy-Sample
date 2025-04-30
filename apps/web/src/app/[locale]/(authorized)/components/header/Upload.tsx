"use client";

import { FaPlus } from "react-icons/fa6";

const Upload = () => {
  const handleUploadPDF = () => {
    const uploadPdfInput = document.getElementById("upload-pdf-input") as HTMLInputElement;

    if (uploadPdfInput) {
      uploadPdfInput.click();
    }
  };
  return (
    <button
      className="sx:hidden px-4 py-1 flex items-center gap-1.5 rounded-xl hover:bg-forground/10 active:text-primary-500"
      onClick={handleUploadPDF}
    >
      <FaPlus className="size-7 p-1.5 bg-primary-200/10 rounded-full shadow" />

      <p className="font-medium">Upload PDF</p>
    </button>
  );
};

export default Upload;
