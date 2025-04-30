import useDrag from "@/hooks/useDrag";
import { IPopover } from "@/hooks/usePopover";
import { IDocumentPage } from "@/schemas/documentSchema";
import CloseIcn from "@icons/doutone/close-circle.svg";
import { DragEvent, ToggleEvent, useEffect, useState } from "react";
import CanvasPage from "../../../classes/CanvasPage";
import { documentManager } from "../../../documentManager";
import OrganizePageAdd from "./OrganizePageAdd";
import OrganizePageCard from "./OrganizePageCard";

const OrganizePages = ({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) => {
  const [documentPages, setSocumentPages] = useState([] as (CanvasPage | IDocumentPage)[]);

  const setStateHandler = () => {
    setSocumentPages(documentManager.pages);
  };

  const setStateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open") {
      setStateHandler();
    }
  };

  useEffect(() => {
    myPopover.popoverRef.current.addEventListener("beforetoggle", setStateOnPopoverOpen as unknown as EventListener);
    return () => {
      myPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  useEffect(() => {
    documentManager.on("canvas:added", setStateHandler);
    documentManager.on("canvas:deleted", setStateHandler);
    documentManager.on("canvas:reorder", setStateHandler);
    return () => {
      documentManager.off("canvas:added", setStateHandler);
      documentManager.off("canvas:deleted", setStateHandler);
      documentManager.off("canvas:reorder", setStateHandler);
    };
  }, []);

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

  const { isDraging, handleDragStart, handleDrag, handleDragEnd } = useDrag();

  const handleDropOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setAttribute("data-dragging", true as unknown as string);
  };

  const handleDropLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.removeAttribute("data-dragging");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    const draggedIndex = Number(e.dataTransfer.getData("aplication/page-index"));

    documentManager.reOrderDocumentPages({ draggedIndex, dropIndex });

    e.currentTarget.removeAttribute("data-dragging");
  };

  return (
    <section
      className="w-64 max-w-[60dvw] h-full bg-gr-multi-dark-revert sm:bg-gr-multi-dark flex flex-col rounded-xl overflow-hidden"
      style={{ border: "none" }}
    >
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>

      <div className="flex justify-center pt-2 sm:pt-3 pb-2">
        <h5>Organize pages</h5>
      </div>
      <div className="w-full flex flex-wrap gap-4 p-4 overflow-y-auto overflow-x-hidden rounded relative">
        {documentPages.map((page, index) => (
          <div
            className="bg-primary-100/10 h-fit flex rounded-md relative z-10 overflow-visible w-full"
            key={page._id}
            draggable
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            onDragStart={(e) => {
              handleDragStart(e);
              e.dataTransfer.setData("aplication/page-index", index as unknown as string);
            }}
          >
            {/* top dropable area */}
            {index === 0 && (
              <div
                className={`absolute left-0 -top-[calc(50%+6px)] w-full h-full flex items-center opacity-0 data-dragging:opacity-100 transition-opacity ${
                  isDraging ? "z-20" : "z-0"
                }`}
                onDragLeave={handleDropLeave}
                onDragOver={handleDropOver}
                onDrop={(e) => handleDrop(e, 0)}
              >
                <div className="w-full h-1.5 bg-primary-500 rounded-full" />
              </div>
            )}

            <OrganizePageCard
              index={index}
              documentPage={page}
              currentPageId={currentPageId}
              parentPopover={myPopover}
            />

            {/* per bottom dropable area */}
            <div
              className={`absolute left-0 -bottom-[calc(50%+8px)] w-full h-full flex items-center opacity-0 data-dragging:opacity-100 transition-opacity ${
                isDraging ? "z-20" : "z-0"
              }`}
              onDragLeave={handleDropLeave}
              onDragOver={handleDropOver}
              onDrop={(e) => handleDrop(e, index + 1)}
            >
              <div className="w-full h-1.5 bg-primary-500 rounded-full" />
            </div>
          </div>
        ))}

        {/* add */}
        <OrganizePageAdd parentPopover={myPopover} totalPageCount={documentPages.length} />
      </div>
    </section>
  );
};

export default OrganizePages;
