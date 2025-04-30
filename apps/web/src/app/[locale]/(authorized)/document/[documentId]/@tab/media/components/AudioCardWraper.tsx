"use client";

import { TMediaAUD } from "@/schemas/mediaSchema";
import { ReactNode } from "react";
import { documentManager } from "../../../documentManager";

const AudioCardWraper = ({ audio, children }: { audio: TMediaAUD; children: ReactNode }) => {
  const handleAddAudio = () => {
    documentManager.addMediaAudio(audio);
  };

  return (
    <div role="button" className="w-full flex items-center gap-2 bg-primary-50/5 rounded-xl" onClick={handleAddAudio}>
      {children}
    </div>
  );
};

export default AudioCardWraper;
