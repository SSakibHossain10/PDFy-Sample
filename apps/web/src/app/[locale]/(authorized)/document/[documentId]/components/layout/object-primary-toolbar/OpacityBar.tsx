import { IPopover } from "@/hooks/usePopover";
import useTouchHold from "@/hooks/useTouchHold";
import { numberMax, numberMin, numberToFixed } from "@/utils/number_formating";
import MinusIcon from "@icons/doutone/minus-fill.svg";
import PlusIcon from "@icons/doutone/plus-fill.svg";
import { ToggleEvent, useEffect, useState } from "react";
import CanvasPage from "../../../classes/CanvasPage";
import { documentManager } from "../../../documentManager";
import { CanvasObject } from "../../../types/document";

const opacitySuggestions = [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 1];

const OpacityBar = ({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) => {
  const [opacity, setOpacity] = useState(1 as unknown as CanvasObject["opacity"]);

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();
    setOpacity(
      activeObject instanceof CanvasPage ? activeObject.backgroundOpacity : (activeObject as CanvasObject).opacity
    );
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
    myPopover.popoverRef.current.addEventListener("beforetoggle", setStateOnPopoverOpen as unknown as EventListener);

    return () => {
      myPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  console.log("opacity", opacity);

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = e.target.valueAsNumber;
    setOpacity(opacity);
    const activeObject = documentManager.currentCanvas.getActiveObject();
    if (activeObject instanceof CanvasPage) {
      documentManager.changePageBackgroundOpacity(opacity);
    } else {
      documentManager.setObjectOpacity(opacity);
    }
  };

  const handleOpacityIncrement = () => {
    setOpacity((prev) => {
      const opacity = numberMax(+prev + 0.01, 1);
      const activeObject = documentManager.currentCanvas.getActiveObject();
      if (activeObject instanceof CanvasPage) {
        documentManager.changePageBackgroundOpacity(opacity);
      } else {
        documentManager.setObjectOpacity(opacity);
      }
      return opacity;
    });
  };

  const handleOpacityDecrement = () => {
    setOpacity((prev) => {
      const opacity = numberMin(+prev - 0.01, 0);
      const activeObject = documentManager.currentCanvas.getActiveObject();
      if (activeObject instanceof CanvasPage) {
        documentManager.changePageBackgroundOpacity(opacity);
      } else {
        documentManager.setObjectOpacity(opacity);
      }
      return opacity;
    });
  };

  const handleChangeOpacity = (opacity: number) => {
    setOpacity(opacity);
    const activeObject = documentManager.currentCanvas.getActiveObject();
    if (activeObject instanceof CanvasPage) {
      documentManager.changePageBackgroundOpacity(opacity);
    } else {
      documentManager.setObjectOpacity(opacity);
    }
  };

  const { handleholdStart: handleIncrementTouchStart, handleholdEnd: handleIncrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleOpacityIncrement,
  });
  const { handleholdStart: handleDecrementTouchStart, handleholdEnd: handleDecrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleOpacityDecrement,
  });

  return (
    <div className="sx:w-full sm:min-w-80 bg-gr-multi-dark flex flex-col sm:flex-col-reverse sx:rounded-2xl sm:rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-2 sx:pt-4">
        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={opacity <= 0}
          onClick={handleOpacityDecrement}
          onTouchStart={handleDecrementTouchStart}
          onTouchEnd={handleDecrementTouchEnd}
          onMouseDown={handleDecrementTouchStart}
          onMouseUp={handleDecrementTouchEnd}
        >
          <MinusIcon className="size-9" />
        </button>

        <div className="grow flex flex-col gap-3 pb-3 pt-1">
          <div className="flex justify-center items-center gap-0.5">
            <input
              type="number"
              value={numberToFixed(opacity * 100, 1)}
              min={0}
              max={1}
              step={0.01}
              onChange={handleOpacityChange}
              enterKeyHint="done"
              className="field-sizing-content text-sm"
            />
            <span className="text-sx">%</span>
          </div>

          <input
            type="range"
            value={opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={handleOpacityChange}
            list="opacity-suggestions-mobile"
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEndCapture={(e) => e.stopPropagation()}
          />
        </div>

        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={opacity >= 1}
          onClick={handleOpacityIncrement}
          onTouchStart={handleIncrementTouchStart}
          onTouchEnd={handleIncrementTouchEnd}
          onMouseDown={handleIncrementTouchStart}
          onMouseUp={handleIncrementTouchEnd}
        >
          <PlusIcon className="size-9" />
        </button>
      </div>

      <datalist
        id="opacity-suggestions-mobile"
        className="grid grid-cols-7 h-7 bg-gradient-to-l from-primary-300/30 to-transparent"
      >
        {opacitySuggestions.map((opacity) => (
          <option
            key={opacity}
            value={opacity}
            className="flex justify-center items-center text-xs font-light active:bg-primary-200/20 border-r last:border-r-0 border-primary-300/20 cursor-pointer"
            onClick={() => handleChangeOpacity(opacity)}
          >
            {opacity * 100}%
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default OpacityBar;
