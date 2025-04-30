"use client";

import { documentManager } from "..documentManager";
import { IDocument, IDocumentPage } from "@/schemas/documentSchema";
import { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import CanvasPage from "../classes/CanvasPage";
import CanvasPageCard from "./canvas-page/CanvasPageCard";
import CanvasContextMenu from "./layout/CanvasContextMenu";
import ObjectTopActionsMenu from "./layout/object-actions-menu/ObjectTopActionsMenu";

interface TContainerRef extends HTMLDivElement {
  last_distance: number | null;
}

const DocumentPagesContainer = ({ document }: { document: IDocument }) => {
  useEffect(() => {
    documentManager.initDocument(document);
  }, []);

  const [documentPages, setDocumentPages] = useState<(IDocumentPage | CanvasPage)[]>(document.pages);

  const handleUpdateDocumentPages = () => {
    setDocumentPages([...documentManager.pages]);
  };

  useEffect(() => {
    documentManager.on("canvas:added", handleUpdateDocumentPages);
    documentManager.on("canvas:deleted", handleUpdateDocumentPages);
    documentManager.on("canvas:reorder", handleUpdateDocumentPages);
    return () => {
      documentManager.off("canvas:added", handleUpdateDocumentPages);
      documentManager.off("canvas:deleted", handleUpdateDocumentPages);
      documentManager.off("canvas:reorder", handleUpdateDocumentPages);
    };
  }, []);

  const containerRef = useRef<TContainerRef>({
    last_distance: null,
  } as unknown as TContainerRef);

  /** Handle Middle Click Panning (Desktop) */
  const handleMiddleClickIn = (e: MouseEvent) => {
    if (!containerRef.current) return;
    if (e.button !== 1) return; // Only middle button
    e.preventDefault();
    containerRef.current.dataset["panning"] = "true";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset["panning"] !== "true") return;

    containerRef.current.scrollBy({
      left: -e.movementX,
      top: -e.movementY,
      behavior: "instant",
    });
  };

  const handleMiddleClickOut = () => {
    if (!containerRef.current) return;
    containerRef.current.dataset["panning"] = "false";
  };

  /** Handle Multi-Touch Zoom & Move (Mobile) */
  const handleTouchStart = (e: TouchEvent) => {
    // e.preventDefault(); //maybe cause issues with canvas touch events
    if (!containerRef.current) return;

    if (e.touches.length === 2) {
      containerRef.current.dataset["panning"] = "true";
      // Pinch zoom start
      const [touch1, touch2] = Array.from(e.touches);
      containerRef.current.last_distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    // e.preventDefault(); //maybe cause issues with canvas touch events
    if (!containerRef.current) return;

    if (e.touches.length === 2 && containerRef.current.last_distance !== null) {
      const [touch1, touch2] = Array.from(e.touches);
      const newDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

      // Calculate zoom factor
      const zoomFactor = newDistance / containerRef.current.last_distance;
      containerRef.current.last_distance = newDistance;

      // Dispatch custom zoom event
      const zoomEvent = new CustomEvent("customZoom", { detail: zoomFactor });
      window.dispatchEvent(zoomEvent);
    }
  };

  const handleTouchEnd = () => {
    // e.preventDefault(); //maybe cause issues with canvas touch events
    if (!containerRef.current) return;
    containerRef.current.dataset["panning"] = "false";

    containerRef.current.last_distance = null;
  };

  return (
    <div className="grow flex overflow-hidden">
      <section
        id="document-pages-wrapper"
        ref={containerRef}
        onMouseDown={handleMiddleClickIn}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMiddleClickOut}
        onMouseLeave={handleMiddleClickOut}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grow min-h-[30%] overflow-auto flex flex-col items-center gap-5 transition-[padding,margin] duration-100 sm:duration-300 ease-out"
      >
        {documentPages.map((documentPageData, index) => (
          <CanvasPageCard key={documentPageData._id} documentPageData={documentPageData} index={index} />
        ))}

        <CanvasContextMenu />
        <ObjectTopActionsMenu />
      </section>
    </div>
  );
};

export default DocumentPagesContainer;
