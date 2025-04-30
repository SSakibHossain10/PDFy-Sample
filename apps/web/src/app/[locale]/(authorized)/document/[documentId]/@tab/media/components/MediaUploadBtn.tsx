"use client";

import addMedia from "@/server-actions/add_media";
import clientNotification from "@/utils/clientNotification";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { FaPlus } from "react-icons/fa6";
import { LiaSpinnerSolid } from "react-icons/lia";

const MediaUploadBtn = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full flex justify-center items-center gap-1 px-2 py-1 text-sm font-semibold relative  disabled:animate-pulse"
    >
      {pending ? <LiaSpinnerSolid className="size-4 animate-spin" /> : <FaPlus className="size-4" />}
      <p>Upload files</p>
      <input
        type="file"
        accept="image/*,video/*,audio/*"
        name="media"
        multiple
        disabled={pending}
        size={1}
        className="opacity-0 absolute inset-0"
        role="button"
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
      />
    </button>
  );
};

const MediaUpload = () => {
  return (
    <Form action={(e) => addMedia(e).then(clientNotification)} className="flex sm:col-span-2">
      <MediaUploadBtn />
    </Form>
  );
};

export default MediaUpload;
