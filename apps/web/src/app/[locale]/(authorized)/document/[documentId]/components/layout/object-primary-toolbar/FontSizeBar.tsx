import useDeviceSize from "@/hooks/useDeviceSize";
import { IPopover } from "@/hooks/usePopover";
import useTouchHold from "@/hooks/useTouchHold";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import { numberMax, numberMin, numberToFixed } from "@/utils/number_formating";
import FontSizeIcn from "@icons/doutone/font-sie.svg";
import MinusIcon from "@icons/doutone/minus-fill.svg";
import PlusIcon from "@icons/doutone/plus-fill.svg";
import { CSSProperties, Fragment, ToggleEvent, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import CanvasTextbox from "../../../classes/CanvasTextbox";
import CanvasFeildInput from "../../../classes/form/CanvasFeildInput";
import CanvasFeildSelect from "../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../classes/form/CanvasFeildTextarea";
import { documentManager } from "../../../documentManager";

const OBJECTS_SHOULD_ACTIVE = [
  CanvasTextbox.type,
  CanvasFeildInput.type,
  CanvasFeildTextarea.type,
  CanvasFeildSelect.type,
  CanvasFeildSelectMultiple.type,
];

const fontSizeSuggestions = [
  6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96, 104, 120, 144,
];

const FontSizeBar = ({
  myPopover,
  parentPopover,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  parentPopover?: IPopover<HTMLDivElement>;
}) => {
  const { sx } = useDeviceSize();

  const [fontSize, setFontSize] = useState(0 as unknown as CanvasTextbox["fontSize"]);

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();
    if (OBJECTS_SHOULD_ACTIVE.includes(activeObject?.type as (typeof OBJECTS_SHOULD_ACTIVE)[number])) {
      setFontSize(numberToFixed((activeObject as CanvasTextbox).fontSize, 1));
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
    if (sx) return;

    (parentPopover as IPopover<HTMLDivElement | HTMLDialogElement>).popoverRef.current.addEventListener(
      "beforetoggle",
      setStateOnPopoverOpen as unknown as EventListener
    );

    return () => {
      (parentPopover as IPopover<HTMLDivElement | HTMLDialogElement>).popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, [sx]);

  useEffect(() => {
    myPopover.popoverRef.current.addEventListener("beforetoggle", setStateOnPopoverOpen as unknown as EventListener);

    return () => {
      myPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  console.log("fontSize", fontSize);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fontSize = numberToFixed(e.target.valueAsNumber, 1);
    setFontSize(fontSize);
    documentManager.changeObjectFontSize(fontSize);
  };

  const handleFontSizeIncrement = () => {
    setFontSize((prev) => {
      const fontSize = numberMax(numberToFixed(+prev + 1, 1), 144);
      documentManager.changeObjectFontSize(fontSize);
      return fontSize;
    });
  };

  const handleFontSizeDecrement = () => {
    setFontSize((prev) => {
      const fontSize = numberMin(numberToFixed(+prev - 1, 1), 5);
      documentManager.changeObjectFontSize(fontSize);
      return fontSize;
    });
  };

  const handleChangeFontSize = (fontSize: number) => {
    setFontSize(fontSize);
    documentManager.changeObjectFontSize(fontSize);
  };

  const { handleholdStart: handleIncrementTouchStart, handleholdEnd: handleIncrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleFontSizeIncrement,
  });
  const { handleholdStart: handleDecrementTouchStart, handleholdEnd: handleDecrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleFontSizeDecrement,
  });

  const { onTouchStart, onTouchMove, onTouchEndCapture } = useTouchVerticalSwiper({
    onSwipingClose: () => myPopover.popoverRef.current?.hidePopover(),
    layoutRef: myPopover.popoverRef,
  });

  return (
    <>
      {/* #sm+-only */}
      <div className="sx:hidden flex h-7 rounded-lg bg-forground/5 border border-forground/10">
        <FaPlus
          role="button"
          className="w-7 h-full px-2 rounded-lg hover:bg-forground/10 active:text-primary-500"
          onClick={handleFontSizeIncrement}
          onTouchStart={handleIncrementTouchStart}
          onTouchEnd={handleIncrementTouchEnd}
          onMouseDown={handleIncrementTouchStart}
          onMouseUp={handleIncrementTouchEnd}
        />
        <input
          value={fontSize}
          type="number"
          list="font-size-suggestions"
          className="h-full field-sizing-content minus-input-arrow-inicator-space px-1 hover:bg-forground/10 active:text-primary-500"
          onChange={handleFontSizeChange}
        />
        <datalist id="font-size-suggestions">
          {fontSizeSuggestions.map((fontSize) => (
            <option key={fontSize} value={fontSize} />
          ))}
        </datalist>
        <FaMinus
          role="button"
          className="w-7 h-full px-2 rounded-lg hover:bg-forground/10 active:text-primary-500"
          onClick={handleFontSizeDecrement}
          onTouchStart={handleDecrementTouchStart}
          onTouchEnd={handleDecrementTouchEnd}
          onMouseDown={handleDecrementTouchStart}
          onMouseUp={handleDecrementTouchEnd}
        />
      </div>

      {/* #sx-only */}
      {/* font size popover btn */}
      <dialog
        popover="manual"
        onClick={(e) => e.stopPropagation()}
        id={myPopover.id}
        ref={myPopover.popoverRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEndCapture={onTouchEndCapture}
        className="popover-animation-translate-from-bottom bottom-[var(--layout-bottom-bar)] w-[calc(100dvw-12px)] mb-1 mx-1.5 font-size-bar-popover open:[&+*]:bg-forground/15"
        style={{ positionAnchor: myPopover.positionAnchor } as CSSProperties}
      >
        <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

        <div className="w-full bg-gr-multi-dark flex flex-col sx:rounded-2xl sm:rounded-t-xl">
          <div className="flex items-center gap-3 p-2 pt-4">
            <button
              className="shrink-0 active:text-primary-500 disabled:opacity-50"
              disabled={fontSize <= 6}
              onClick={handleFontSizeDecrement}
              onTouchStart={handleDecrementTouchStart}
              onTouchEnd={handleDecrementTouchEnd}
              onMouseDown={handleDecrementTouchStart}
              onMouseUp={handleDecrementTouchEnd}
            >
              <MinusIcon className="size-9" />
            </button>

            <div className="grow flex flex-col gap-2 pb-3 pt-1">
              <div className="flex justify-center">
                <input
                  type="number"
                  value={fontSize}
                  min={5}
                  max={144}
                  onChange={handleFontSizeChange}
                  enterKeyHint="done"
                  className="field-sizing-content text-sm"
                />
              </div>

              <input
                type="range"
                value={fontSize}
                min={5}
                max={144}
                onChange={handleFontSizeChange}
                list="font-size-suggestions-mobile"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEndCapture={(e) => e.stopPropagation()}
              />
            </div>

            <button
              className="shrink-0 active:text-primary-500 disabled:opacity-50"
              disabled={fontSize >= 144}
              onClick={handleFontSizeIncrement}
              onTouchStart={handleIncrementTouchStart}
              onTouchEnd={handleIncrementTouchEnd}
              onMouseDown={handleIncrementTouchStart}
              onMouseUp={handleIncrementTouchEnd}
            >
              <PlusIcon className="size-9" />
            </button>
          </div>

          <datalist
            id="font-size-suggestions-mobile"
            className="flex justify-evenly items-center bg-primary-200/5 overflow-x-auto scrollbar-hidden"
          >
            {fontSizeSuggestions.map((fontSize) => (
              <Fragment key={fontSize}>
                <option
                  value={fontSize}
                  className="text-xs px-2.5 py-1.5 active:bg-primary-200/10"
                  onClick={() => handleChangeFontSize(fontSize)}
                >
                  {fontSize}
                </option>
                <div className="h-7 border-l border-primary-200/5 last:hidden" />
              </Fragment>
            ))}
          </datalist>
        </div>
      </dialog>
      <button
        aria-describedby="font-size-tooltip"
        popoverTarget={myPopover.popoverTarget}
        className="sm:hidden flex flex-col items-center gap-1 p-1.25 rounded-lg hover:[&+*]:inline active:[&+*]:inline"
        style={{ anchorName: "--font-size-anchor" } as CSSProperties}
      >
        <FontSizeIcn className="size-5" />
        <span className="text-2xs text-nowrap">Font size</span>
      </button>
      {/* font-size-tooltip */}
      <div
        id="font-size-tooltip"
        className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
        style={
          {
            positionAnchor: "--font-size-anchor",
          } as CSSProperties
        }
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
          Font size
        </p>
      </div>
    </>
  );
};

export default FontSizeBar;
