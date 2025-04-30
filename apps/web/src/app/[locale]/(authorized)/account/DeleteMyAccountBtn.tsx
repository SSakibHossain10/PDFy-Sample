"use client";

import deleteUserAccount from "@/server-actions/delete_user_acount";
import clientNotification from "@/utils/clientNotification";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { LiaSpinnerSolid } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";

const DeleteMyAccountBtn = () => {
  const { pending } = useFormStatus();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = () => {
    dialogRef.current?.showModal();
  };
  const handleCloseDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        type="button"
        popoverTargetAction="show"
        className="bg-red-500 text-black w-full px-10 py-2 flex items-center justify-center gap-2 text-sm rounded-full"
        onClick={handleOpenDialog}
      >
        Delete my account
      </button>

      <dialog
        ref={dialogRef}
        className="opacity-0 open:opacity-100 m-auto inset-0 overflow-hidden shadow-xl rounded-2xl"
      >
        <div className="bg-gr-multi-dark flex flex-col p-4 gap-6 items-stretch rounded-2xl overflow-auto max-h-dvh">
          <h4 className="px-6 text-center font-semibold">Delete account</h4>

          <h6 className="text-center">
            Are you sure you want to delete your account? This action is irreversible and will delete all your data.
          </h6>

          <div className="flex justify-end gap-4">
            <button type="button" popoverTargetAction="hide" className="text-sm" onClick={handleCloseDialog}>
              Cancel
            </button>
            <button
              formAction={() => deleteUserAccount().then(clientNotification)}
              disabled={pending}
              className="bg-red-500 text-white px-3 py-2 flex items-center justify-center gap-1 text-sm rounded-full disabled:animate-pulse"
            >
              {pending ? <LiaSpinnerSolid className="size-4 animate-spin" /> : <MdDeleteOutline className="size-4" />}
              <p>Yes delete</p>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteMyAccountBtn;
