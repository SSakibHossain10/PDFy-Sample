import CanvasTextbox from "@/app/[locale]/(authorized)/document/[documentId]/classes/CanvasTextbox";
import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import usePopover, { IPopover } from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import ListTypeCircleIcn from "@icons/list-type-circle.svg";
import ListTypeDiscIcn from "@icons/list-type-disc.svg";
import ListTypeNumericIcn from "@icons/list-type-numeric.svg";
import ListTypeSquareIcn from "@icons/list-type-square.svg";
import { CSSProperties, ToggleEvent, useEffect, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

const OBJECTS_SHOULD_ACTIVE = [CanvasTextbox.type];

function ListTypeBar({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement | HTMLDivElement> }) {
  const [listType, setListType] = useState("none" as unknown as CanvasTextbox["listType"]);

  const myPopover = usePopover<HTMLDialogElement>();

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();

    if (OBJECTS_SHOULD_ACTIVE.includes(activeObject?.type as (typeof OBJECTS_SHOULD_ACTIVE)[number])) {
      setListType((activeObject as CanvasTextbox).listType);
    }
  };

  const setStateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open") {
      setStateHandler();

      documentManager.on("selection:updated", setStateHandler);
    } else {
      documentManager.off("selection:updated", setStateHandler);
    }
  };

  useEffect(() => {
    parentPopover.popoverRef.current.addEventListener(
      "beforetoggle",
      setStateOnPopoverOpen as unknown as EventListener
    );

    return () => {
      parentPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  const handleChangeListType = (listTypeVal: CanvasTextbox["listType"]) => {
    if (listType === listTypeVal) {
      setListType("none");
      documentManager.changeTextListType("none");
    } else {
      {
        setListType(listTypeVal);
        documentManager.changeTextListType(listTypeVal);
      }
    }
  };

  const { onTouchStart, onTouchMove, onTouchEndCapture } = useTouchVerticalSwiper({
    onSwipingClose: () => myPopover.popoverRef.current?.hidePopover(),
    layoutRef: myPopover.popoverRef,
  });

  return (
    <>
      <dialog
        popover="auto"
        onClick={(e) => {
          e.stopPropagation();
          myPopover.popoverRef.current?.hidePopover();
        }}
        id={myPopover.id}
        ref={myPopover.popoverRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEndCapture={onTouchEndCapture}
        className="popover-animation-opacity position-area-top sm:position-area-bottom mb-1.5 sm:mt-1 open:[&+*>.text-list-type-popover-action-btn]:bg-forground/15"
        style={{ positionAnchor: myPopover.positionAnchor } as CSSProperties}
      >
        <div className="bg-gr-multi-dark rounded-xl overflow-hidden">
          <span className="absolute sm:hidden top-0.5 left-[50%] -translate-x-[50%] h-0.5 w-7 rounded-md bg-primary-200/50" />

          <div className="bg-forground/5 flex px-1">
            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                listType === "disc"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeListType("disc")}
            >
              <ListTypeDiscIcn className="size-6 sm:size-5" />
            </button>

            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                listType === "circle"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeListType("circle")}
            >
              <ListTypeCircleIcn className="size-6 sm:size-5" />
            </button>

            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                listType === "square"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeListType("square")}
            >
              <ListTypeSquareIcn className="size-6 sm:size-5" />
            </button>

            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                listType === "numeric"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeListType("numeric")}
            >
              <ListTypeNumericIcn className="size-6 sm:size-5" />
            </button>
          </div>
        </div>
      </dialog>

      <div className="grow flex">
        <div
          role="button"
          aria-describedby="list-tooltip"
          style={{ anchorName: myPopover.anchorName } as CSSProperties}
          className={`grow flex flex-col items-center gap-1 p-1.25 sx:pr-2 sm:pr-1 rounded-lg hover:[&+*]:inline active:[&+*]:inline ${
            listType && listType !== "none"
              ? "bg-forground/15 text-primary-200 active:text-primary-500"
              : "hover:bg-forground/10 active:text-primary-500"
          }`}
          onClick={() =>
            handleChangeListType(
              listType === "disc" ? "numeric" : listType === "numeric" ? "none" : listType === "none" ? "disc" : "disc"
            )
          }
        >
          {listType === "circle" ? (
            <ListTypeCircleIcn className="size-5" />
          ) : listType === "disc" ? (
            <ListTypeDiscIcn className="size-5" />
          ) : listType === "numeric" ? (
            <ListTypeNumericIcn className="size-5" />
          ) : listType === "square" ? (
            <ListTypeSquareIcn className="size-5" />
          ) : (
            <ListTypeDiscIcn className="size-5" />
          )}

          <span className="sm:hidden text-2xs">List</span>
        </div>
        {/* list-tooltip */}
        <div
          id="list-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
          style={{ positionAnchor: myPopover.anchorName } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
            List
          </p>
        </div>

        <button
          popoverTarget={myPopover.popoverTarget}
          onClick={(e) => e.stopPropagation()}
          className="z-10 -mx-2 right-0 w-5 rounded-lg hover:bg-forground/10 active:text-primary-500 flex sm:items-end justify-center text-list-type-popover-action-btn"
        >
          <MdArrowDropUp className="size-4 rotate-45 sm:hidden" />
          <MdArrowDropDown className="size-4 -rotate-45 sx:hidden" />
        </button>
      </div>
    </>
  );
}

export default ListTypeBar;
