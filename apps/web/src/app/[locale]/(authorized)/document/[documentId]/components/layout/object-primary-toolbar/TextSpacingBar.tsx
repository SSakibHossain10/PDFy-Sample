import { IPopover } from "@/hooks/usePopover";
import useTouchHold from "@/hooks/useTouchHold";
import { numberMax, numberMin, numberToFixed } from "@/utils/number_formating";
import MinusIcon from "@icons/doutone/minus-fill.svg";
import PlusIcon from "@icons/doutone/plus-fill.svg";
import { Fragment, ToggleEvent, useEffect, useState } from "react";
import CanvasTextbox from "../../../classes/CanvasTextbox";
import { documentManager } from "../../../documentManager";

const charSpacingSuggestions = [-100, 0, 100, 200, 300, 400, 500, 600, 700];
const lineHeightSuggestions = [0.5, 1, 1.2, 1.5, 2, 2.5];

function TextSpacingBar({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) {
  const [charSpacing, setCharSpacing] = useState(0 as unknown as CanvasTextbox["charSpacing"]);
  const [lineHeight, setLineHeight] = useState(0 as unknown as CanvasTextbox["lineHeight"]);

  const setStateHandler = () => {
    setCharSpacing(
      numberToFixed((documentManager.currentCanvas.getActiveObject() as CanvasTextbox).charSpacing || 0, 1)
    );
    setLineHeight(
      numberToFixed((documentManager.currentCanvas.getActiveObject() as CanvasTextbox).lineHeight || 1.4, 1)
    );
  };

  const setStateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    console.log("e.newState", e.newState);

    if (e.newState === "open") {
      setStateHandler();

      documentManager.on("selection:updated", setStateHandler);
    } else {
      documentManager.off("selection:updated", setStateHandler);
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

  const handleCharSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const charSpacing = numberToFixed(e.target.valueAsNumber, 1);
    setCharSpacing(charSpacing);
    documentManager.changeObjectCharSpacing(charSpacing);
  };

  const handleCharSpacingIncrement = () => {
    setCharSpacing((prev) => {
      const charSpacing = numberMax(numberToFixed(+prev + 1, 1), 800);
      documentManager.changeObjectCharSpacing(charSpacing);
      return charSpacing;
    });
  };
  const handleCharSpacingDecrement = () => {
    setCharSpacing((prev) => {
      const charSpacing = numberMin(numberToFixed(+prev - 1, 1), -200);
      documentManager.changeObjectCharSpacing(charSpacing);
      return charSpacing;
    });
  };

  const handleChangeCharSpacing = (charSpacing: number) => {
    setCharSpacing(charSpacing);
    documentManager.changeObjectCharSpacing(charSpacing);
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lineHeight = numberToFixed(e.target.valueAsNumber, 1);
    setLineHeight(lineHeight);
    documentManager.changeObjectLineHeight(lineHeight);
  };

  const handleLineHeightIncrement = () => {
    setLineHeight((prev) => {
      const lineHeight = numberMax(numberToFixed(+prev + 1, 1), 3);
      documentManager.changeObjectLineHeight(lineHeight);
      return lineHeight;
    });
  };
  const handleLineHeightDecrement = () => {
    setLineHeight((prev) => {
      const lineHeight = numberMin(numberToFixed(+prev - 1, 1), 0.5);
      documentManager.changeObjectLineHeight(lineHeight);
      return lineHeight;
    });
  };

  const handleChangeLineHeight = (lineHeight: number) => {
    setLineHeight(lineHeight);
    documentManager.changeObjectLineHeight(lineHeight);
  };

  const { handleholdStart: handleCharIncrementTouchStart, handleholdEnd: handleCharIncrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleCharSpacingIncrement,
  });
  const { handleholdStart: handleCharDecrementTouchStart, handleholdEnd: handleCharDecrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleCharSpacingDecrement,
  });

  const { handleholdStart: handleLineIncrementTouchStart, handleholdEnd: handleLineIncrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleLineHeightIncrement,
  });
  const { handleholdStart: handleLineDecrementTouchStart, handleholdEnd: handleLineDecrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleLineHeightDecrement,
  });

  return (
    <div className="sx:w-full sm:min-w-70 px-3.5 sm:px-2.5 py-2 pt-5 sm:pt-2.5 bg-gr-multi-dark sx:rounded-2xl sm:rounded-xl flex flex-col gap-1 ">
      <div className="flex flex-col">
        <p className="text-center">Letter spacing</p>
        <div className="flex items-center gap-3">
          <button
            className="shrink-0 active:text-primary-500 disabled:opacity-50"
            disabled={charSpacing <= -200}
            onClick={handleCharSpacingDecrement}
            onTouchStart={handleCharDecrementTouchStart}
            onTouchEnd={handleCharDecrementTouchEnd}
            onMouseDown={handleCharDecrementTouchStart}
            onMouseUp={handleCharDecrementTouchEnd}
          >
            <MinusIcon className="size-9 sm:size-8" />
          </button>

          <div className="grow flex flex-col gap-2 sm:gap-3 pb-3 pt-1">
            <input
              type="number"
              value={charSpacing}
              min={-200}
              max={800}
              onChange={handleCharSpacingChange}
              enterKeyHint="done"
              className="field-sizing-content text-sm mx-auto"
            />

            <input
              type="range"
              value={charSpacing}
              min={-200}
              max={800}
              step={1}
              onChange={handleCharSpacingChange}
              list="char-spacing-suggestions"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEndCapture={(e) => e.stopPropagation()}
            />
            <datalist id="char-spacing-suggestions">
              {charSpacingSuggestions.map((charSpacing) => (
                <Fragment key={charSpacing}>
                  <option value={charSpacing} onClick={() => handleChangeCharSpacing(charSpacing)} />
                  <div className="h-7 border-l border-primary-200/5" />
                </Fragment>
              ))}
            </datalist>
          </div>

          <button
            className="shrink-0 active:text-primary-500 disabled:opacity-50"
            disabled={charSpacing >= 800}
            onClick={handleCharSpacingIncrement}
            onTouchStart={handleCharIncrementTouchStart}
            onTouchEnd={handleCharIncrementTouchEnd}
            onMouseDown={handleCharIncrementTouchStart}
            onMouseUp={handleCharIncrementTouchEnd}
          >
            <PlusIcon className="size-9 sm:size-8" />
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-center">Line spacing</p>
        <div className="flex items-center gap-3">
          <button
            className="shrink-0 active:text-primary-500 disabled:opacity-50"
            disabled={lineHeight <= 0.5}
            onClick={handleLineHeightDecrement}
            onTouchStart={handleLineDecrementTouchStart}
            onTouchEnd={handleLineDecrementTouchEnd}
            onMouseDown={handleLineDecrementTouchStart}
            onMouseUp={handleLineDecrementTouchEnd}
          >
            <MinusIcon className="size-9 sm:size-8" />
          </button>

          <div className="grow flex flex-col gap-2 sm:gap-3 pb-3 pt-1">
            <input
              type="number"
              value={lineHeight}
              step={0}
              min={0.5}
              max={3}
              onChange={handleLineHeightChange}
              enterKeyHint="done"
              className="field-sizing-content text-sm mx-auto"
            />
            <input
              type="range"
              value={lineHeight}
              min={0.5}
              max={3}
              step={0.01}
              onChange={handleLineHeightChange}
              list="line-spacing-suggestions"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEndCapture={(e) => e.stopPropagation()}
            />
            <datalist id="line-spacing-suggestions">
              {lineHeightSuggestions.map((lineHeight) => (
                <Fragment key={lineHeight}>
                  <option value={lineHeight} onClick={() => handleChangeLineHeight(lineHeight)} />
                  <div className="h-7 border-l border-primary-200/5" />
                </Fragment>
              ))}
            </datalist>
          </div>

          <button
            className="shrink-0 active:text-primary-500 disabled:opacity-50"
            disabled={lineHeight >= 3}
            onClick={handleLineHeightIncrement}
            onTouchStart={handleLineIncrementTouchStart}
            onTouchEnd={handleLineIncrementTouchEnd}
            onMouseDown={handleLineIncrementTouchStart}
            onMouseUp={handleLineIncrementTouchEnd}
          >
            <PlusIcon className="size-9 sm:size-8" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextSpacingBar;
