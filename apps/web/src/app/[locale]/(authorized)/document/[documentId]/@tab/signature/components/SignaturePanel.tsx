"use client";

import { caveat } from "@/app/fonts/signature/Caveat";
import { cedarville_cursive } from "@/app/fonts/signature/Cedarville_Cursive";
import { dancing_script } from "@/app/fonts/signature/Dancing_Script";
import { give_you_glory } from "@/app/fonts/signature/Give_You_Glory";
import { kristi } from "@/app/fonts/signature/Kristi";
import { mr_de_haviland } from "@/app/fonts/signature/Mr_De_Haviland";
import { norican } from "@/app/fonts/signature/Norican";
import { over_the_rainbow } from "@/app/fonts/signature/Over_the_Rainbow";
import { reenie_beanie } from "@/app/fonts/signature/Reenie_Beanie";
import { satisfy } from "@/app/fonts/signature/Satisfy";
import { stalemate } from "@/app/fonts/signature/Stalemate";
import { zeyada } from "@/app/fonts/signature/Zeyada";
import { TFont } from "@/schemas/fontSchema";
import React, { useState } from "react";
import { documentManager } from "../../../documentManager";

const SignaturePanel = ({ signatureFonts }: { signatureFonts: TFont[] }) => {
  const [signetureText, setSignetureText] = useState("Signature");

  const handleChangeSignatureText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignetureText(e.target.value);
  };

  const handleAddSignatureText = (font: TFont) => {
    documentManager.addSignatureText(signetureText, { fontFamily: font.name });
    documentManager.addFontToDocument(font);
  };

  console.log("signatureFonts", signatureFonts);

  return (
    <>
      <input
        autoFocus
        placeholder="Type sign"
        value={signetureText}
        onChange={handleChangeSignatureText}
        className="bg-primary-50/10 mx-4 px-3 py-1.5 text-sm text-center rounded-full"
      />

      <div
        className={`min-h-20 flex justify-center flex-wrap gap-5 mx-4 pt-4 pb-6 overflow-auto scrollbar-hidden ${caveat.className} ${cedarville_cursive.className} ${dancing_script.className} ${give_you_glory.className} ${kristi.className} ${mr_de_haviland.className} ${norican.className} ${over_the_rainbow.className} ${reenie_beanie.className} ${satisfy.className} ${stalemate.className} ${zeyada.className}`}
      >
        {signatureFonts.map((font) => (
          <button
            key={font._id}
            style={{ fontFamily: font.name }}
            className="text-xl"
            onClick={() => handleAddSignatureText(font)}
          >
            {signetureText}
          </button>
        ))}
      </div>
    </>
  );
};

export default SignaturePanel;
