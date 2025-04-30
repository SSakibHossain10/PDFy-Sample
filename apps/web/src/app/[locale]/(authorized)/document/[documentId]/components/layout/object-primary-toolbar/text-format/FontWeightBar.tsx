import { DEFAULT_AVAILABLE_FONT_WEIGHTS, DEFAULT_FONT_FAMILY, DEFAULT_FONT_WEIGHT } from "@/constants/document";
import usePopover, { IPopover } from "@/hooks/usePopover";
import BoldIcn from "@icons/bold.svg";
import FontWeight100 from "@icons/font-weight-100.svg";
import FontWeight200 from "@icons/font-weight-200.svg";
import FontWeight300 from "@icons/font-weight-300.svg";
import FontWeight400 from "@icons/font-weight-400.svg";
import FontWeight500 from "@icons/font-weight-500.svg";
import FontWeight600 from "@icons/font-weight-600.svg";
import FontWeight700 from "@icons/font-weight-700.svg";
import FontWeight800 from "@icons/font-weight-800.svg";
import FontWeight900 from "@icons/font-weight-900.svg";

import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import { CSSProperties, ToggleEvent, useEffect, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import CanvasTextbox from "../../../../classes/CanvasTextbox";
import { documentManager } from "../../../../documentManager";

const FontWeightBar = ({ parentPopover }: { parentPopover: IPopover<HTMLDivElement | HTMLDialogElement> }) => {
  const [fontWeight, setFontWeight] = useState<CanvasTextbox["fontWeight"]>(
    "" as unknown as CanvasTextbox["fontWeight"]
  );
  const [fontFamily, setFontFamily] = useState<CanvasTextbox["fontFamily"]>(
    "" as unknown as CanvasTextbox["fontFamily"]
  );

  const myPopover = usePopover<HTMLDialogElement>();

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();
    setFontWeight((activeObject as CanvasTextbox).fontWeight || DEFAULT_FONT_WEIGHT);
    setFontFamily((activeObject as CanvasTextbox).fontFamily || DEFAULT_FONT_FAMILY);
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

  const [availableFontWeights, setAvailableFontWeights] = useState(DEFAULT_AVAILABLE_FONT_WEIGHTS);

  useEffect(() => {
    setAvailableFontWeights(documentManager.getFontByName(fontFamily)?.weight || DEFAULT_AVAILABLE_FONT_WEIGHTS);
  }, [fontFamily]);

  const handleSetFontWeight = (fontWeight: CanvasTextbox["fontWeight"]) => {
    setFontWeight(fontWeight);
    documentManager.changeObjectFontWeight(fontWeight);
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
        className="popover-animation-opacity position-area-top sm:position-area-bottom mb-1.5 sm:mt-1 open:[&+*>.font-weight-popover-action-btn]:bg-forground/15"
        style={{ positionAnchor: myPopover.positionAnchor } as CSSProperties}
      >
        <span className="absolute sm:hidden top-0.5 left-[50%] -translate-x-[50%] h-0.5 w-7 rounded-md bg-primary-200/50" />

        <div className="bg-gr-multi-dark rounded-xl overflow-hidden">
          <div className="bg-forground/5 flex px-1">
            <FontWeight100
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 100
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("100")}
            />

            <FontWeight200
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 200
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("200")}
            />

            <FontWeight300
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 300
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("300")}
            />

            <FontWeight400
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 400
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("400")}
            />

            <FontWeight500
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 500
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("500")}
            />

            <FontWeight600
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 600
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("600")}
            />

            <FontWeight700
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 700
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("700")}
            />

            <FontWeight800
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 800
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("800")}
            />

            <FontWeight900
              role="button"
              className={`w-8 h-9 sm:w-7 sm:h-8 py-2 px-1 rounded-md ${
                Number(fontWeight) === 900
                  ? "bg-forground/15 text-primary-200 active:text-primary-500"
                  : "hover:bg-forground/10 active:text-primary-500"
              }`}
              onClick={() => handleSetFontWeight("900")}
            />
          </div>
        </div>
      </dialog>

      <div className="grow flex">
        <div
          role="button"
          aria-describedby="bold-tooltip"
          data-disabled={!availableFontWeights.some((weight) => Number(weight) >= 700)}
          className={`grow flex flex-col items-center gap-1 p-1.25 pr-2 rounded-lg data-[desabled=true]:cursor-not-allowed] hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50 ${
            Number(fontWeight) >= 700
              ? "bg-forground/15 text-primary-200 active:text-primary-500"
              : "hover:bg-forground/10 active:text-primary-500"
          }`}
          style={{ anchorName: myPopover.anchorName } as CSSProperties}
          onClick={() => handleSetFontWeight(Number(fontWeight) >= 700 ? "400" : "700")}
        >
          <BoldIcn className="size-5" />

          <span className="sm:hidden text-2xs">Bold</span>
        </div>
        {/* bold-tooltip */}
        <div
          id="bold-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
          style={{ positionAnchor: myPopover.anchorName } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
            {availableFontWeights.some((weight) => Number(weight) >= 700) ? "Bold" : "This font does not support bold"}
          </p>
        </div>

        <button
          popoverTarget={myPopover.popoverTarget}
          onClick={(e) => e.stopPropagation()}
          className="z-10 -mx-2 right-0 w-5 rounded-lg hover:bg-forground/10 active:text-primary-500 flex sm:items-end justify-center font-weight-popover-action-btn"
        >
          <MdArrowDropUp className="size-4 rotate-45 sm:hidden" />
          <MdArrowDropDown className="size-4 -rotate-45 sx:hidden" />
        </button>
      </div>
    </>
  );
};

export default FontWeightBar;
