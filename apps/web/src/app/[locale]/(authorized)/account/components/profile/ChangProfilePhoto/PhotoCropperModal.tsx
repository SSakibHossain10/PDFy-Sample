import { IPopover } from "@/hooks/usePopover";
import changeUserAvator from "@/server-actions/change_user_avator";
import clientNotification from "@/utils/clientNotification";
import { ToggleEvent, useState } from "react";
import { LiaSpinnerSolid } from "react-icons/lia";
import ImageCropper from "../../../classes/ImageCropper";
import "../../../styles/photo_cropper.css";

let imageCropper: ImageCropper;

const PhotoCropperModal = ({ myPopover, imgFile }: { myPopover: IPopover<HTMLDialogElement>; imgFile?: File }) => {
  const handleOpenPhotoCropper = (e: ToggleEvent<HTMLDialogElement>) => {
    if (e.newState === "open" && imgFile) {
      const image = new Image();
      image.src = URL.createObjectURL(imgFile);
      image.onload = () => {
        imageCropper = new ImageCropper(image);
      };
    } else {
      imageCropper?.dispose();
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleChangePhoto = async () => {
    setSubmitting(true);
    changeUserAvator(imageCropper.getCropedImage())
      .then((res) => {
        myPopover.popoverRef.current.hidePopover();
        clientNotification(res);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <dialog
      popover="manual"
      id={myPopover.id}
      className="bg-gr-multi-dark popover-animation-opacity m-auto inset-0 relative overflow-hidden shadow-xl rounded-2xl photo-cropper-modal backdrop:bg-white/10"
      style={{ maxWidth: "calc(100dvw - 5px)", maxHeight: "calc(100dvh - 5px)" }}
      ref={myPopover.popoverRef}
      onToggle={handleOpenPhotoCropper}
    >
      <div className="flex flex-col p-4 gap-4 overflow-hidden">
        <canvas id="photo-cropper-canvas" className="border aspect-square min-w-30 min-h-30 max-w-full max-h-full" />

        <button
          popoverTarget={myPopover.popoverTarget}
          popoverTargetAction="hide"
          className="bg-primary-50/10 w-full px-5 py-1.5 text-xs font-semibold text-center rounded-full"
        >
          Cancal
        </button>

        <button
          className="bg-primary-50/10 w-full px-5 py-1.5 text-xs font-semibold flex justify-center items-center gap-2 rounded-full disabled:animate-pulse"
          disabled={submitting}
          onClick={handleChangePhoto}
        >
          {submitting && <LiaSpinnerSolid className="size-4 animate-spin" />}
          {submitting ? "Submitting" : "Submit"}
        </button>
      </div>
    </dialog>
  );
};

export default PhotoCropperModal;
