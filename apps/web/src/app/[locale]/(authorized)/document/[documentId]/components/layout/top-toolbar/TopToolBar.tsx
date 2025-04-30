"use client";

import { PDFY_LOGO } from "@/constants";
import Link from "next/link";
import { CSSProperties } from "react";
import AutoSave from "./AutoSave";
import Export from "./Export";
import OranizePagesIcn from "./OranizePagesIcn";
import UndoRedo from "./UndoRedo";
import ZoomBar from "./ZoomBar";

const TopToolBar = () => {
  return (
    <header
      className="shrink-0 h-11 pl-4 pr-2 bg-primary-50/10 flex items-center gap-1 border-b border-primary-200/5 overflow-x-auto scrollbar-hidden"
      id="editor-top-toolbar"
    >
      <Link
        href="/"
        aria-describedby="home-tooltip"
        className="shrink-0 hover:[&+*]:inline active:[&+*]:inline"
        style={{ anchorName: "--home-anchor" } as CSSProperties}
      >
        <img loading="lazy" src={PDFY_LOGO} alt="PDFy" width={28} height={28} />
      </Link>
      {/* home-tooltip */}
      <div
        id="home-tooltip"
        className="hidden transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[right]"
        style={{ positionAnchor: "--home-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 ml-1 text-sm text-nowrap rounded-2xl shadow-lg">
          Back to home
        </p>
      </div>

      <UndoRedo />

      <span className="grow" />
      <AutoSave />
      <span className="grow" />

      <ZoomBar />

      <Export />

      <OranizePagesIcn />
    </header>
  );
};

export default TopToolBar;
