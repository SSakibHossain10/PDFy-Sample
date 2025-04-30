"use client";

import { IDocumentPage } from "@/schemas/documentSchema";
import { CSSProperties, useEffect, useState } from "react";
import CanvasPage from "../../classes/CanvasPage";
import { documentManager } from "../../documentManager";

const CanvasPageCard = ({
  documentPageData,
  index,
}: {
  documentPageData: IDocumentPage | CanvasPage;
  index: number;
}) => {
  const [currentPageId, setCurrentPageId] = useState<string>("");

  const updateCurrentPageId = () => {
    setCurrentPageId(documentManager.currentCanvas._id);
  };

  useEffect(() => {
    documentManager.on("current-canvas:changed", updateCurrentPageId);
    return () => {
      documentManager.off("current-canvas:changed", updateCurrentPageId);
    };
  }, []);

  return (
    <section
      className={`max-w-full max-h-full m-auto relative canvas-page-container${!currentPageId && index === 0 ? "" : documentPageData._id === currentPageId ? "" : " hidden"}`}
    >
      <div className="canvas-page-wapper transition-[padding-bottom] duration-100 sm:duration-300 ease-out">
        <div
          className="w-full h-full flex justify-center items-center m-auto"
          style={
            {
              width: "calc-size(fit-content, size * var(--page-zoom-factor))",
              height: "calc-size(fit-content, size * var(--page-zoom-factor))",
              anchorName: `--canvas-${documentPageData._id}`,
            } as CSSProperties
          }
        >
          {documentPageData.thumbnail ? (
            <img
              loading="lazy"
              src={documentPageData.thumbnail}
              alt="document-page-placeholder"
              width={documentPageData.width}
              height={documentPageData.height}
              className="absolute blur-xs max-w-full h-auto bg-primary-100/25 animate-pulse"
            />
          ) : (
            <span className="absolute" />
          )}
          <canvas
            id={`canvas-${documentPageData._id}`}
            className="lower-canvas max-w-full max-h-full"
            height={documentPageData.height}
            width={documentPageData.width}
          />
        </div>
      </div>
    </section>
  );
};

export default CanvasPageCard;
