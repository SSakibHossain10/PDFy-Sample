"use client";

import { TMediaIMG } from "@/schemas/mediaSchema";
import { ReactNode } from "react";
import { documentManager } from "../../../documentManager";

const ImageCardWraper = ({ image, children }: { image: TMediaIMG; children: ReactNode }) => {
  const handleAddImage = () => {
    documentManager.addMediaImage(image);
  };

  return (
    <div
      role="button"
      className="grow flex justify-center items-center bg-primary-50/10 rounded-lg"
      onClick={handleAddImage}
    >
      {children}
    </div>
  );
};

export default ImageCardWraper;
