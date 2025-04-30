import CanvasTextbox from "@/app/[locale]/(authorized)/document/[documentId]/classes/CanvasTextbox";
import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import usePopover, { IPopover } from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import TextAlignCenterIcn from "@icons/text-align-center.svg";
import TextAlignJustifyIcn from "@icons/text-align-justify.svg";
import TextAlignLeftIcn from "@icons/text-align-left.svg";
import TextAlignRightIcn from "@icons/text-align-right.svg";
import { CSSProperties, ToggleEvent, useEffect, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import CanvasFeildInput from "../../../../../classes/form/CanvasFeildInput";
import CanvasFeildSelect from "../../../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../../../classes/form/CanvasFeildTextarea";

const OBJECTS_SHOULD_ACTIVE = [
  CanvasTextbox.type,
  CanvasFeildInput.type,
  CanvasFeildTextarea.type,
  CanvasFeildSelect.type,
  CanvasFeildSelectMultiple.type,
];

function TextAlignBar({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement | HTMLDivElement> }) {
  const [textAlign, setTextAlign] = useState<CanvasTextbox["textAlign"]>("" as unknown as CanvasTextbox["textAlign"]);

  const myPopover = usePopover<HTMLDialogElement>();

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();

    if (OBJECTS_SHOULD_ACTIVE.includes(activeObject?.type as (typeof OBJECTS_SHOULD_ACTIVE)[number])) {
      setTextAlign((activeObject as CanvasTextbox).textAlign);
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

  const handleChangeTextAlign = (textAlign: CanvasTextbox["textAlign"]) => {
    setTextAlign(textAlign);
    documentManager.changeObjectTextAlign(textAlign);
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
        className="popover-animation-opacity position-area-top sm:position-area-bottom mb-1.5 sm:mt-1 open:[&+*>.text-align-popover-action-btn]:bg-forground/15"
        style={{ positionAnchor: myPopover.positionAnchor } as CSSProperties}
      >
        <span className="absolute sm:hidden top-0.5 left-[50%] -translate-x-[50%] h-0.5 w-7 rounded-md bg-primary-200/50" />

        <div className="bg-gr-multi-dark rounded-xl overflow-hidden">
          <div className="bg-forground/5 flex px-1">
            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                textAlign === "left"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeTextAlign("left")}
            >
              <TextAlignLeftIcn className="size-6 sm:size-5" />
            </button>

            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                textAlign === "center"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeTextAlign("center")}
            >
              <TextAlignCenterIcn className="size-6 sm:size-5" />
            </button>

            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                textAlign === "right"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeTextAlign("right")}
            >
              <TextAlignRightIcn className="size-6 sm:size-5" />
            </button>

            <button
              className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
                textAlign === "justify"
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleChangeTextAlign("justify")}
            >
              <TextAlignJustifyIcn className="size-6 sm:size-5" />
            </button>
          </div>
        </div>
      </dialog>

      <div className="grow flex">
        <div
          role="button"
          aria-describedby="text-align-tooltip"
          style={{ anchorName: myPopover.anchorName } as CSSProperties}
          className="grow flex flex-col items-center gap-1 p-1.25 sx:pr-2 sm:pr-1 rounded-lg hover:[&+*]:inline active:[&+*]:inline hover:bg-forground/10 active:text-primary-500"
          onClick={() =>
            handleChangeTextAlign(
              textAlign === "left"
                ? "center"
                : textAlign === "center"
                  ? "right"
                  : textAlign === "right"
                    ? "justify"
                    : "left"
            )
          }
        >
          {textAlign === "center" ? (
            <TextAlignCenterIcn className="size-5" />
          ) : textAlign === "right" ? (
            <TextAlignRightIcn className="size-5" />
          ) : textAlign === "justify" ? (
            <TextAlignJustifyIcn className="size-5" />
          ) : (
            <TextAlignLeftIcn className="size-5" />
          )}

          <span className="sm:hidden text-2xs">Align</span>
        </div>

        {/* text-align-tooltip */}
        <div
          id="text-align-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
          style={
            {
              positionAnchor: myPopover.anchorName,
            } as CSSProperties
          }
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Text align
          </p>
        </div>

        <button
          popoverTarget={myPopover.popoverTarget}
          onClick={(e) => e.stopPropagation()}
          className={`z-10 -mx-2 right-0 w-5 rounded-lg hover:bg-forground/10 active:text-primary-500 flex sm:items-end justify-center text-align-popover-action-btn`}
        >
          <MdArrowDropUp className="size-4 rotate-45 sm:hidden" />
          <MdArrowDropDown className="size-4 -rotate-45 sx:hidden" />
        </button>
      </div>
    </>
  );
}

export default TextAlignBar;
