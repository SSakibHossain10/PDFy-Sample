"use client";

import usePopover from "@/hooks/usePopover";
import { useRef, useState } from "react";
import PhotoCropperModal from "./PhotoCropperModal";

const ChangProfilePhoto = () => {
  const photoPickerInputRef = useRef<HTMLInputElement>(null);
  const photoCropperPopover = usePopover<HTMLDialogElement>();

  const [imgFile, setImgFile] = useState<File>();

  const handlePickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImgFile(e.target.files[0]);
    photoCropperPopover.popoverRef.current.showPopover();
  };

  return (
    <>
      <button
        className="bg-primary-50/10 px-5 py-1.5 text-xs font-semibold rounded-full"
        onClick={() => photoPickerInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          hidden
          ref={photoPickerInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0].size <= 1048576) {
              handlePickPhoto(e);
            } else {
              alert("File size should be less than 1 MB");
            }
          }}
        />
        Change Photo
      </button>
      <PhotoCropperModal myPopover={photoCropperPopover} imgFile={imgFile} />
    </>
  );
};

export default ChangProfilePhoto;
