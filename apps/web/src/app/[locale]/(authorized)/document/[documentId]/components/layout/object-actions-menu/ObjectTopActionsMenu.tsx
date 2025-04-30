import usePopover from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import { CSSProperties, RefObject, useEffect, useRef } from "react";
import { GoDuplicate } from "react-icons/go";
import { MdDeleteOutline, MdMoreHoriz, MdOutlineLock } from "react-icons/md";
import CanvasPage from "../../../classes/CanvasPage";
import { documentManager } from "../../../documentManager";
import { duplicateActiveObjects, lockActiveObjects, removeActiveObjects } from "../../../utils/canvasUtils";
import ObjectMoreActionsMenu from "./ObjectMoreActionsMenu";

const OBJECT_TOP_ACTION_OFSET = 20;

const ObjectTopActionsMenu = () => {
  const objectBoundingAreaEl = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const topActionMenuEl = useRef<HTMLElement>(null) as RefObject<HTMLElement>;

  const objectMoreActionMenuPopoderData = usePopover<HTMLDialogElement>();

  const showObjectTopActionsMenu = () => {
    const currentCanvas = documentManager.currentCanvas;
    const activeObject = documentManager.currentCanvas.getActiveObject();

    if (!activeObject) return;
    if (activeObject instanceof CanvasPage) return; // don't show for page canvas selection

    const objBoundingRect = activeObject.getBoundingRect();
    const objBoundingRectZoomAdjusted = {
      left: ((objBoundingRect.left - OBJECT_TOP_ACTION_OFSET) / currentCanvas.width) * 100,
      top: ((objBoundingRect.top - OBJECT_TOP_ACTION_OFSET) / currentCanvas.height) * 100,
      width: currentCanvas.width / (objBoundingRect.width + OBJECT_TOP_ACTION_OFSET * 2),
      height: currentCanvas.height / (objBoundingRect.height + OBJECT_TOP_ACTION_OFSET * 2),
    };

    topActionMenuEl.current.classList.remove("hidden", "scale-x-0");
    topActionMenuEl.current.classList.add("flex", "scale-x-full");

    //@ts-expect-error
    objectBoundingAreaEl.current.style.positionAnchor = `--canvas-${currentCanvas._id}`;
    objectBoundingAreaEl.current.style.left = `anchor(${objBoundingRectZoomAdjusted.left}%)`;
    objectBoundingAreaEl.current.style.top = `anchor(${objBoundingRectZoomAdjusted.top}%)`;
    objectBoundingAreaEl.current.style.width = `calc(anchor-size(width) / ${objBoundingRectZoomAdjusted.width})`;
    objectBoundingAreaEl.current.style.height = `calc(anchor-size(height) / ${objBoundingRectZoomAdjusted.height})`;
  };

  const hideObjectTopActionsMenu = () => {
    topActionMenuEl.current.classList.add("hidden", "scale-x-0");
    topActionMenuEl.current.classList.remove("flex", "scale-x-full");
  };

  useEffect(() => {
    //# show
    documentManager.on("selection:created", showObjectTopActionsMenu);
    documentManager.on("selection:updated", showObjectTopActionsMenu);
    documentManager.on("object:modified", showObjectTopActionsMenu);
    //# hide
    documentManager.on("selection:cleared", hideObjectTopActionsMenu);
    documentManager.on("object:moving", hideObjectTopActionsMenu);
    documentManager.on("object:resizing", hideObjectTopActionsMenu);
    documentManager.on("object:rotating", hideObjectTopActionsMenu);
    documentManager.on("object:scaling", hideObjectTopActionsMenu);
    documentManager.on("object:skewing", hideObjectTopActionsMenu);
    documentManager.on("text:editing:entered", hideObjectTopActionsMenu);

    return () => {
      documentManager.off("selection:created", showObjectTopActionsMenu);
      documentManager.off("selection:updated", showObjectTopActionsMenu);
      documentManager.off("object:modified", showObjectTopActionsMenu);
      documentManager.off("selection:cleared", hideObjectTopActionsMenu);
      documentManager.off("object:moving", hideObjectTopActionsMenu);
      documentManager.off("object:resizing", hideObjectTopActionsMenu);
      documentManager.off("object:rotating", hideObjectTopActionsMenu);
      documentManager.off("object:scaling", hideObjectTopActionsMenu);
      documentManager.off("object:skewing", hideObjectTopActionsMenu);
      documentManager.off("text:editing:entered", hideObjectTopActionsMenu);
    };
  });

  const {
    onTouchStart: moreActionsOnTouchStart,
    onTouchMove: moreActionsOnTouchMove,
    onTouchEndCapture: moreActionsOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => objectMoreActionMenuPopoderData.popoverRef.current?.hidePopover(),
    layoutRef: objectMoreActionMenuPopoderData.popoverRef,
  });

  return (
    <>
      <div
        className="fixed top-0 left-0 h-0 w-0 invisible"
        ref={objectBoundingAreaEl}
        style={
          {
            anchorName: "--object-bounding-area",
            positionTryFallbacks: "top, bottom, right, left, center",
          } as CSSProperties
        }
      />
      <section
        ref={topActionMenuEl}
        className="fixed z-10 p-0.5 pl-1 hidden items-center bg-gr-multi-dark rounded-xl object-top-actions-menu transition-discrete duration-100 scale-x-0 starting:scale-x-0 transition-all"
        aria-label="object top actions menu"
        style={
          {
            positionAnchor: "--object-bounding-area",
            positionArea: "top",
            positionTryFallbacks: "top, bottom, right, left, center",
          } as CSSProperties
        }
      >
        <MdOutlineLock
          aria-describedby="lock-tooltip"
          size={28}
          className="p-1 rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--lock-anchor" } as CSSProperties}
          onClick={() => lockActiveObjects(documentManager.currentCanvas)}
        />
        {/* lock-tooltip */}
        <div
          id="lock-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] position-fallbacks-[top,_bottom,_left,_right]"
          style={{ positionAnchor: "--lock-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 m-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Lock
          </p>
        </div>

        <GoDuplicate
          aria-describedby="duplicate-tooltip"
          size={28}
          className="rotate-90 p-1 rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--duplicate-anchor" } as CSSProperties}
          strokeWidth={0.5}
          onClick={() => duplicateActiveObjects(documentManager.currentCanvas)}
        />
        {/* duplicate-tooltip */}
        <div
          id="duplicate-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] position-fallbacks-[top,_bottom,_left,_right]"
          style={{ positionAnchor: "--duplicate-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 m-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Duplicate
          </p>
        </div>

        <MdDeleteOutline
          aria-describedby="delete-tooltip"
          size={28}
          className="p-1 rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--delete-anchor" } as CSSProperties}
          onClick={() => removeActiveObjects(documentManager.currentCanvas)}
        />
        {/* delete-tooltip */}
        <div
          id="delete-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] position-fallbacks-[top,_bottom,_left,_right]"
          style={{ positionAnchor: "--delete-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 m-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Delete
          </p>
        </div>

        <dialog
          ref={objectMoreActionMenuPopoderData.popoverRef}
          onTouchStart={moreActionsOnTouchStart}
          onTouchMove={moreActionsOnTouchMove}
          onTouchEndCapture={moreActionsOnTouchEndCapture}
          popover="auto"
          id={objectMoreActionMenuPopoderData.id}
          className="popover-animation-opacity transition-discrete sx:w-full bottom-0 sm:position-area-bottom-right sm:position-fallbacks-bottom-right more-panel-popover open:[&+*]:bg-forground/15"
          style={
            {
              positionAnchor: objectMoreActionMenuPopoderData.positionAnchor,
            } as CSSProperties
          }
        >
          <span className="visible absolute sm:hidden top-1.25 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

          <ObjectMoreActionsMenu parentPopover={objectMoreActionMenuPopoderData} />
        </dialog>
        <button
          aria-describedby="more-tooltip"
          popoverTarget={objectMoreActionMenuPopoderData.popoverTarget}
          className="p-1 rounded-xl hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: objectMoreActionMenuPopoderData.anchorName } as CSSProperties}
        >
          <MdMoreHoriz size={20} className="text-3xl" />
        </button>
        {/* more-tooltip */}
        <div
          id="more-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] position-fallbacks-[top,_bottom,_left,_right]"
          style={{ positionAnchor: objectMoreActionMenuPopoderData.anchorName } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 m-2 text-sm text-nowrap rounded-2xl shadow-lg">
            More
          </p>
        </div>
      </section>
    </>
  );
};

export default ObjectTopActionsMenu;
