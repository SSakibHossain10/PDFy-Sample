"use client";

import { TMediaVID } from "@/schemas/mediaSchema";
import { ReactNode } from "react";
import { documentManager } from "../../../documentManager";

const VideoCardWraper = ({ video, children }: { video: TMediaVID; children: ReactNode }) => {
  const handleAddVideo = () => {
    documentManager.addMediaVideo(video);
  };

  return (
    <div
      role="button"
      className="grow flex justify-center items-center bg-primary-50/10 rounded-lg"
      onClick={handleAddVideo}
    >
      {children}
    </div>
  );
};

export default VideoCardWraper;
